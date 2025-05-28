import { search } from "@/api";
import { queryOptions } from "@tanstack/react-query";

export const transactionsOptions = queryOptions({
  queryKey: ["prefetchTrans"],
  queryFn: async () => {
    return search("");
  },
  retry: 1,
});
