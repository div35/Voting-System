import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button, Carousel } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import web3 from "../web3.js";

const compiledElection = require("../ethereum/build/Election.json");

const ElectionCard = (props) => {
  const [parties, setParties] = useState([]);
  const partiesCrousel = parties.map((p) => {
    return (
      <Carousel.Item className="mb-3" key={p[0]}>
        <h5>{p[0]}</h5>
      </Carousel.Item>
    );
  });

  useEffect(async () => {
    const address = props.data[0];

    const contract = new web3.eth.Contract(
      JSON.parse(JSON.stringify(compiledElection.abi)),
      address
    );

    const partiesData = await contract.methods.getParties().call();
    setParties(partiesData);
  }, []);

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

          <Row className="my-2">{<Carousel>{partiesCrousel}</Carousel>}</Row>
          <Row>
            <p>
              Managed By: <b>{props.data.manager}</b>
            </p>
          </Row>
        </Col>
        <Col md="4">
          <NavLink to={`/${props.data.add}`} style={{ textDecoration: "none" }}>
            <Button
              variant="light"
              type="submit"
              style={{ margin: "80px 0px" }}
            >
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
