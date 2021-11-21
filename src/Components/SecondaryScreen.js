import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import web3 from "../web3.js";
const compiledElection = require("../ethereum/build/Election.json");

const Election = (props) => {
  const [electionName, setElectionName] = useState("");
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [parties, setParties] = useState([]);

  const castVoteHandler = (e) => {
    e.preventDefault();
    const id = e.target.value;
    props.history.push(`/${props.match.params.id}/verify/${id}`);
  };

  useEffect(async () => {
    const address = props.match.params.id;

    const contract = new web3.eth.Contract(
      JSON.parse(JSON.stringify(compiledElection.abi)),
      address
    );

    const name = await contract.methods.name().call();
    setElectionName(name);

    const count = await contract.methods.totalVotes().call();
    setTotalVoteCount(count);

    const partiesData = await contract.methods.getParties().call();
    setParties(partiesData);
  }, []);

  const partiesCards = (
    <Row>
      {parties.map((p, i) => {
        return (
          <Col className="my-2" key={i}>
            <Card style={{ width: "18rem" }}>
              <Card.Img
                style={{ width: "17rem", height: "17rem", margin: "auto" }}
                variant="top"
                src={p.image}
                className="p-2"
              />
              <Card.Body>
                <Card.Title
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
                  {p.name}
                </Card.Title>
                <Card.Text>
                  Leader: <b>{p.leaderName}</b>
                </Card.Text>
                <Button
                  variant="light"
                  type="submit"
                  value={i}
                  onClick={(e) => castVoteHandler(e)}
                >
                  Cast Vote
                </Button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

  return (
    <Container>
      <Container>
        <Row>
          <Col></Col>
          <Col md="6">
            <h1 className="text-center">{electionName}</h1>
          </Col>
          <Col md="3">
            <Button variant="danger">Add Party</Button>
          </Col>
        </Row>
        <Row className="border-bottom rounded my-2 py-2">
          <Col className="my-1">
            <h4>Total Votes: {totalVoteCount} votes</h4>
          </Col>
          <Col></Col>
          <Col></Col>
          <Col>
            <Button variant="danger" type="submit">
              Declare Result
            </Button>
          </Col>
        </Row>
      </Container>
      <Row>{partiesCards}</Row>
    </Container>
  );
};

export default Election;
