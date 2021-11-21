import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button, Carousel } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const ElectionCard = (props) => {
  // const partiesCrousel = props.data.parties.map((p) => {
  //   return (
  //     <Carousel.Item className="mb-3" key={p}>
  //       <h5>{p}</h5>
  //     </Carousel.Item>
  //   );
  // });
  console.log(props.data)
  return (
    <Container>
      <Row className="border rounded py-2 my-4">
        <Col></Col>
        <Col md="6">
          <Row>
            <h2
              style={{
                backgroundColor: "#f3ec78",
                backgroundImage: "linear-gradient(45deg, #f3ec78, #af4261)",
                backgroundSize: "100%",
                WebkitBackgroundClip: "text",
                MozBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                MoxTextFillColor: "transparent",
              }}
            >
              {props.data.name}
            </h2>
          </Row>
          
          <Row className="my-2">
            {/* <Carousel fade>{partiesCrousel}</Carousel> */}
          </Row>
          <Row>
            <p>Managed By: {props.data.manager}</p>
          </Row>
        </Col>
        <Col md="4">
          <NavLink
            to={`/election/${props.data.address}`}
            style={{ textDecoration: "none" }}
          >
            <Button variant="primary" type="submit" style={{margin:"80px 0px"}}>
              Ready To Cast Vote
            </Button>
          </NavLink>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default ElectionCard;
