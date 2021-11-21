import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import web3 from "../web3.js";
const compiledElection = require("../ethereum/build/Election.json");

const Election = (props) => {
  const [err, setErr] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [create, setCreate] = useState(false);

  const [partyName, setPartyName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [region, setRegion] = useState("");
  const [image, setImage] = useState("");

  const [electionName, setElectionName] = useState("");
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [parties, setParties] = useState([]);

  const castVoteHandler = (e) => {
    e.preventDefault();
    const id = e.target.value;
    props.history.push(`/${props.match.params.id}/verify/${id}`);
  };

  const refresh = async () => {
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
  }

  useEffect(async () => {
    refresh();
  }, []);

  const addPartyHandler = (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    create ? setCreate(false) : setCreate(true);
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    setLoading(true);
    try {
      await window.ethereum.send("eth_requestAccounts");
      const accounts = await web3.eth.getAccounts();

      const electionAddress = props.match.params.id;
      const election = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        electionAddress
      );
      await election.methods.addParty(partyName, leaderName, memberCount, region, image).send({
        from: accounts[0],
        gas: '3000000'
      });

      refresh();
      setMessage("Party Added Successfully!!");
    } catch (err) {
      console.log(err);
      setErr(err.message);
    }
    setLoading(false);
  };

  const createForm = (
    <Container className="pb-3">
      <Row>
        <Col></Col>
        <Col className="border rounded py-3 px-4">
          <Form onSubmit={submitFormHandler}>
            <Form.Group className="mx-3 mt-2 mb-3" controlId="formBasicEmail">
              <Form.Label>
                <b>Party Name</b>
              </Form.Label>
              <Row>
                <Col>
                  {" "}
                  <Form.Control
                    required
                    type="partyName"
                    placeholder="Enter Party Name"
                    value={partyName}
                    onChange={(e) => {
                      setPartyName(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mx-3" controlId="formBasicPassword">
              <Form.Label>
                <b>Candidate Name</b>
              </Form.Label>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    required
                    type="leaderName"
                    placeholder="Enter Name of the Candidate"
                    value={leaderName}
                    onChange={(e) => {
                      setLeaderName(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mx-3" controlId="formBasicURL">
              <Form.Label>
                <b>Image URL</b>
              </Form.Label>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    required
                    type="imageURL"
                    placeholder="Enter Party's Logo URL"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mx-3" controlId="formBasicCount">
              <Form.Label>
                <b>Total Number of Members</b>
              </Form.Label>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    required
                    type="count"
                    placeholder="Enter Total Number of Members in Your Party"
                    value={memberCount}
                    onChange={(e) => {
                      setMemberCount(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mx-3" controlId="formBasicRegion">
              <Form.Label>
                <b>Region</b>
              </Form.Label>
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    required
                    type="region"
                    placeholder="Enter Your Region"
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>

            {err ? <p style={{ color: "red" }}>{err}</p> : null}
            {message ? <p style={{ color: "green" }}>{message}</p> : null}
            <Button
              className="m-2"
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Add"
              )}
            </Button>
          </Form>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );

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
    <div
      className="pt-3"
      style={{
        minHeight: "100vh",
        backgroundColor: create ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
        backdropFilter: "blur(15px)",
      }}
    >
      <Container>
        <Row>
          <Col></Col>
          <Col md="6">
            <h1 className="text-center">
              {create ? "Create A New Election" : electionName}
            </h1>
          </Col>
          <Col md="3">
            <Button
              variant="danger"
              onClick={(e) => addPartyHandler(e)}
              disabled={loading}
            >
              {create ? "Cancel" : "Add Party"}
            </Button>
          </Col>
        </Row>
        {create ? null : (
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
        )}
      </Container>
      <br />
      {create ? createForm : <Row>{partiesCards}</Row>}
    </div>
  );
};

export default Election;
