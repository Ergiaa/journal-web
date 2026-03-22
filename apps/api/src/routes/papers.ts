import { Elysia, t } from "elysia";
import { papersService } from "../services/papers";

// TypeBox schemas
const SortBy = t.Union([
  t.Literal("relevance"),
  t.Literal("date_desc"),
  t.Literal("date_asc"),
  t.Literal("title_asc"),
  t.Literal("author_asc"),
]);

const FacetItem = t.Object({
  value: t.String(),
  count: t.Number(),
});

const Facets = t.Object({
  journals: t.Array(FacetItem),
  authors: t.Array(FacetItem),
  years: t.Array(FacetItem),
  keywords: t.Array(FacetItem),
});

const PaperSchema = t.Object({
  id: t.String(),
  title: t.String(),
  abstract: t.Optional(t.String()),
  authors: t.Array(t.String()),
  publishedAt: t.String(),
  journal: t.Optional(t.String()),
  doi: t.Optional(t.String()),
  keywords: t.Optional(t.Array(t.String())),
  sourceUrl: t.String(),
  source: t.Optional(t.String()),
  sourceId: t.Optional(t.String()),
  citationCount: t.Number(),
  embeddingStored: t.Boolean(),
  createdAt: t.String(),
});

const SearchResultSchema = t.Object({
  papers: t.Array(PaperSchema),
  total: t.Number(),
  page: t.Number(),
  pageSize: t.Number(),
  facets: Facets,
});

export const papersRoutes = new Elysia({ prefix: "/api" })
  .onError(({ error, set }) => {
    console.error("[API Error]", error);
    set.status = 500;
    return { error: "Internal server error" };
  })
  .get(
    "/papers",
    ({ query }) => {
      return papersService.search({
        q: query.q,
        page: query.page ?? 1,
        pageSize: query.pageSize ?? 10,
        authorFilter: query.author,
        journalFilter: query.journal,
        keywordFilter: query.keyword,
        yearFrom: query.yearFrom,
        yearTo: query.yearTo,
        sortBy: query.sortBy,
      });
    },
    {
      query: t.Object({
        q: t.Optional(t.String()),
        page: t.Optional(t.Numeric()),
        pageSize: t.Optional(t.Numeric()),
        author: t.Optional(t.String()),
        journal: t.Optional(t.Array(t.String())),
        keyword: t.Optional(t.Array(t.String())),
        yearFrom: t.Optional(t.Numeric()),
        yearTo: t.Optional(t.Numeric()),
        sortBy: t.Optional(SortBy),
      }),
      response: { 200: SearchResultSchema },
    },
  )
  .get(
    "/papers/:id",
    async ({ params, set }) => {
      const paper = await papersService.getById(params.id);
      if (!paper) {
        set.status = 404;
        return { error: "Paper not found" };
      }
      return paper;
    },
    {
      params: t.Object({ id: t.String() }),
      response: {
        200: PaperSchema,
        404: t.Object({ error: t.String() }),
      },
    },
  )
  .get(
    "/papers/:id/related",
    async ({ params, query }) => {
      const limit = query.limit ?? 5;
      return papersService.getRelated(params.id, limit);
    },
    {
      params: t.Object({ id: t.String() }),
      query: t.Object({ limit: t.Optional(t.Numeric()) }),
      response: {
        200: t.Array(PaperSchema),
      },
    },
  );

export const journalsRoutes = new Elysia({ prefix: "/api" })
  .onError(({ error, set }) => {
    console.error("[API Error]", error);
    set.status = 500;
    return { error: "Internal server error" };
  })
  .get("/journals", () => papersService.getAvailableJournals(), {
    response: { 200: t.Array(t.String()) },
  });
