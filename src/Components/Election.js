import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Image,
} from "react-bootstrap";
import web3 from "../web3.js";
import { PieChart, Pie, Legend, Tooltip } from "recharts";
import SpinnerBar from "./CustomSpinner.js";
const compiledElection = require("../ethereum/build/Election.json");

const Election = (props) => {
  const [err, setErr] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [create, setCreate] = useState(false);

  const [isManager, setIsManager] = useState(false);

  const [partyName, setPartyName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [region, setRegion] = useState("");
  const [image, setImage] = useState("");

  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [electionName, setElectionName] = useState("");
  const [totalVoteCount, setTotalVoteCount] = useState(0);
  const [parties, setParties] = useState([]);
  const [haveData, setHaveData] = useState(false);
  const [data, setData] = useState([]);

  const [result, setResult] = useState([]);

  const [startLoading, setStartLoading] = useState(false);

  const castVoteHandler = (e) => {
    e.preventDefault();
    const id = e.target.value;
    props.history.push(`/${props.match.params.id}/verify/${id}`);
  };

  const address = props.match.params.id;

  useEffect(async () => {
    setStartLoading(true);
    setErr(null);
    let contract;
    try {
      contract = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        address
      );

      await window.ethereum.send("eth_requestAccounts");

      const accounts = await web3.eth.getAccounts();
      const manager = await contract.methods.manager().call();
      if (manager === accounts[0]) {
        setIsManager(true);
      }
    } catch (err) {
      setErr(err);
      setTimeout(() => {
        setErr(null);
      }, 5000);
    }

    try {
      const name = await contract.methods.name().call();
      setElectionName(name);

      const count = await contract.methods.totalVotes().call();
      setTotalVoteCount(count);

      const partiesData = await contract.methods.getParties().call();
      setParties(partiesData);

      setIsStarted(await contract.methods.isStarted().call());
      const tempComp = await contract.methods.isCompleted().call();
      setIsCompleted(tempComp);
      // console.log(tempComp);
      if (tempComp) {
        const tempRes = await contract.methods.getResults().call();
        setResult(tempRes);
        const tempdata = tempRes.map((r, i) => {
          if (r != 0) setHaveData(true);
          return {
            name:
              partiesData[i] && partiesData[i].name ? partiesData[i][0] : "",
            value: +r,
          };
        });
        setData(tempdata);
      }
    } catch (err) {
      setErr(err);
      setTimeout(() => {
        setErr(null);
      }, 5000);
    }

    setStartLoading(false);
  }, []);

  const addPartyHandler = (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    create ? setCreate(false) : setCreate(true);
  };

  const startElectionHandler = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    setLoading(true);
    let contract;
    try {
      contract = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        address
      );
      await window.ethereum.send("eth_requestAccounts");
      const accounts = await web3.eth.getAccounts();
      const curr = new Date().getTime();
      const end = +new Date().getTime() + 10 * 24 * 60 * 60 * 1000;
      await contract.methods.startElection(curr, end).send({
        from: accounts[0],
        gas: "3000000",
      });
      setIsStarted(true);
      setLoading(false);
      setMessage("You Have successfully Started the Election!!!");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (err) {
      setErr(err.message);
      setLoading(false);

      setTimeout(() => {
        setErr(null);
      }, 5000);
    }
  };

  const declareResultHandler = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    setLoading(true);
    let contract;
    try {
      contract = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        address
      );
      await window.ethereum.send("eth_requestAccounts");
      const accounts = await web3.eth.getAccounts();
      await contract.methods.endElection().send({
        from: accounts[0],
        gas: "3000000",
      });
      setIsCompleted(true);
      setLoading(false);
      setMessage("You Have successfully Ended the Election!!!");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      const tempRes = await contract.methods.getResults().call();
      setResult(tempRes);
      const tempdata = tempRes.map((r, i) => {
        if (r != 0) setHaveData(true);
        return {
          name: parties[i] && parties[i].name ? parties[i][0] : "",
          value: +r,
        };
      });
      setData(tempdata);
    } catch (err) {
      setErr(err.message);
      setLoading(false);

      setTimeout(() => {
        setErr(null);
      }, 5000);
    }
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setErr(null);
    setMessage(null);
    setLoading(true);
    try {
      await window.ethereum.send("eth_requestAccounts");
      const accounts = await web3.eth.getAccounts();

      const contract = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        address
      );
      await contract.methods
        .addParty(partyName, leaderName, memberCount, region, image)
        .send({
          from: accounts[0],
          gas: "3000000",
        });

      const partiesData = await contract.methods.getParties().call();
      setParties(partiesData);

      setMessage("Party Added Successfully!!");

      setPartyName("");
      setLeaderName("");
      setImage("");
      setMemberCount(0);
      setRegion("");
    } catch (err) {
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
            {err ? (
              <Row>
                <p style={{ color: "red" }}>{err}</p>
              </Row>
            ) : null}
            {message ? (
              <Row>
                <p style={{ color: "#76ff03" }}>{message}</p>
              </Row>
            ) : null}
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
  console.log(data);
  const chart = (
    <Row>
      <Col className=" col d-flex justify-content-center">
        <PieChart width={450} height={450}>
          <Pie data={data} cx={200} cy={200} outerRadius={100} fill="#8884d8" />
          <Pie
            data={data}
            cx={200}
            cy={200}
            innerRadius={110}
            outerRadius={130}
            fill="#82ca9d"
            label
          />
          <Tooltip />
        </PieChart>
      </Col>
    </Row>
  );

  let partiesCards =
    parties && parties.length > 0 ? (
      <Row>
        {parties.map((p, i) => {
          return (
            <Col className="my-2 col d-flex justify-content-center" key={i}>
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  style={{ width: "17rem", height: "17rem", margin: "auto" }}
                  variant="top"
                  src={p.image}
                  className="p-2"
                />
                <Card.Body>
                  <Card.Title>{p.name}</Card.Title>
                  <Card.Text>
                    Lead By <b style={{ color: "#e0e0e0" }}> {p.leaderName}</b>
                  </Card.Text>
                  {isCompleted || !isStarted ? null : (
                    <Button
                      variant="light"
                      type="submit"
                      value={i}
                      onClick={(e) => castVoteHandler(e)}
                    >
                      Cast Vote
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    ) : (
      <Row>
        <Col></Col>
        <Col>
          <Image
            className="rounded"
            src="https://assets.materialup.com/uploads/805362d3-e9d6-4aa7-b314-ed9dde22558b/preview.gif"
          />
        </Col>
        <Col></Col>
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
      {startLoading ? (
        <SpinnerBar />
      ) : (
        <Container>
          <Row>
            <Col></Col>
            <Col md="6">
              <h1 className="text-center">
                {create ? "Enroll A Party" : electionName}
              </h1>
            </Col>
            <Col md="3">
              {isStarted ? null : isManager ? (
                <Button
                  variant="danger"
                  onClick={(e) => addPartyHandler(e)}
                  disabled={loading}
                >
                  {create ? "Cancel" : "Add Party"}
                </Button>
              ) : null}
            </Col>
          </Row>

          {create ? null : (
            <Row className="border-bottom rounded my-2 py-2">
              <Col className="my-1">
                {isStarted ? <h4>{totalVoteCount} Vote(s)</h4> : null}
              </Col>
              <Col></Col>
              <Col></Col>
              <Col>
                {isManager ? (
                  isStarted ? (
                    isCompleted ? null : (
                      <Button
                        variant="danger"
                        onClick={(e) => declareResultHandler(e)}
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
                          "End Election"
                        )}
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="danger"
                      onClick={(e) => startElectionHandler(e)}
                      disabled={loading || parties.length < 2}
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
                        "Start Election"
                      )}
                    </Button>
                  )
                ) : null}
              </Col>
            </Row>
          )}
          {create ? null : err ? (
            <Row>
              <p style={{ color: "red" }}>{err}</p>
            </Row>
          ) : null}

          {create ? null : message ? (
            <Row>
              <p style={{ color: "#76ff03" }}>{message}</p>
            </Row>
          ) : null}
          <br />
          {isCompleted && result.length > 0 && haveData ? chart : null}
          {isCompleted && !haveData ? (
            <h5 className="mb-4">
              No vote has been casted in this election!!!
            </h5>
          ) : null}
          {create ? createForm : <Row>{partiesCards}</Row>}
        </Container>
      )}
    </div>
  );
};

export default Election;
