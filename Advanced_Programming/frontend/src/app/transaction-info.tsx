"use client";

import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useMutation } from "@tanstack/react-query";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DataTable from "@/components/Table";
import { useMemo } from "react";
import { TRANSACTIONS_COLUMNS } from "@/utils/transactrionColumns";
import { search } from "@/api";
import { transactionsOptions } from "./transaction";

export function TransactionInfo() {
  const mutation = useMutation({
    mutationFn: (params: string) => search(params), // Định nghĩa rõ kiểu dữ liệu
    onSuccess: (response) => {
      console.log("Search successful:", response);
    },
    onError: (error) => {
      console.error("Search failed:", error);
      alert(error);
    },
  });

  const { data } = useSuspenseQuery(transactionsOptions);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const searchValue = formData.get("detail_key") as string;
    mutation.mutate(searchValue);
  };

  const columns = useMemo(() => TRANSACTIONS_COLUMNS, []);

  const dataToShow = mutation.data ?? data;
  const table = useReactTable({
    data: dataToShow.records ?? [],
    columns,
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <Container className="py-3 g-4">
        <Row className="gx-3 d-flex align-items-stretch">
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Print Statement Report</Card.Title>
                <Card.Text>
                  Generate a Detailed Report of Transactions
                </Card.Text>
                <Button variant="primary" style={{ height: 50 }}>
                  <i className="bi bi-printer-fill"></i> Print Report
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Tổng số tiền</Card.Title>
                <Card.Text style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {dataToShow.records
                    ? new Intl.NumberFormat("de-DE").format(
                        dataToShow.records.reduce(
                          (sum, transaction) => sum + transaction.credit,
                          0
                        )
                      )
                    : "-"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container>
        <Form onSubmit={handleSubmit}>
          <Row className="g-2">
            <Col xs={5}>
              <Form.Group className="mb-3" controlId="detail_key">
                <Form.Control
                  type="text"
                  name="detail_key"
                  placeholder="Nhập nội dung tìm kiếm"
                />
              </Form.Group>
            </Col>
            <Col>
              <Button variant="primary" type="submit">
                <i className="bi bi-search"></i> Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>

      <Container>
        <DataTable table={table} />
      </Container>
    </div>
  );
}
