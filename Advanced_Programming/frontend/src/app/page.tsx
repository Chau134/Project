import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/get-query-client";
import { transactionsOptions } from "./transaction";
import { TransactionInfo } from "./transaction-info";

export default function Home() {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(transactionsOptions);
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TransactionInfo />
      </HydrationBoundary>
    </div>
  );
}
