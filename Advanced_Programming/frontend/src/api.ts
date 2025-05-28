const BaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Transactions = {
  date_time: string;
  trans_no: string;
  credit: number;
  debit: number;
  detail: string;
  doc_no: string;
};

export const search = async (params: string) => {
  const response = await fetch(`${BaseUrl}/query?q=${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response, "mmmm");
  if (!response.ok) throw new Error(response.statusText);
  let rawText = await response.text();

  // Loại bỏ ký tự xuống dòng dư thừa và xử lý JSON
  rawText = rawText.replace(/\\n\\\"}/g, "}");
  rawText = JSON.parse(rawText);
  const result = JSON.parse(rawText);

  if (!Array.isArray(result.records)) {
    console.error("Invalid data format: 'records' is not an array.");
    throw new Error("Invalid data format: 'records' is not an array.");
  }

  const transactions: Transactions[] = result.records.map((item: any) => {
    if (
      item.date_time &&
      typeof item.date_time === "string" &&
      item.date_time.includes("_")
    ) {
      const [date_time, doc_no] = item.date_time.split("_");
      return {
        ...item,
        date_time,
        doc_no,
      };
    }
    return item;
  });

  return { total: result.total, records: transactions };
};
