"use client";

import { Navbar } from "react-bootstrap"; // Không đổi tên ở đây
import Container from "react-bootstrap/Container";
import Image from "next/image";
import logo from "@/public/logo.jpg";

const MyNavbar = () => {
  return (
    <Navbar style={{ backgroundColor: "#FFFCD9" }}>
      <Container>
        <Navbar.Brand href="#home">
          {" "}
          {/* Sử dụng Navbar.Brand */}
          <Image
            alt=""
            src={logo}
            width="100"
            height="100"
            className="d-inline-block align-center"
          />{" "}
          <strong>TRANG SAO KÊ MẶT TRẬN TỔ QUỐC VIỆT NAM</strong>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
