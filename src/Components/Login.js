import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import compiledElection from "./../ethereum/build/Election.json"
import web3 from "./../web3"

const Login = (props) => {
  const [aadhaar, setaadhaar] = useState("");
  const [otp, setotp] = useState("");
  const [partyData, setPartyData] = useState(null);

  const submitFormHandler = (e) => {
    e.preventDefault();
  };

  const address = props.match.params.address;
  const index = props.match.params.id;

  useEffect(async () => {
    try{
      const election = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        address
      );

      const party = await election.methods.getPartyDetails(index).call();
      setPartyData(party)

    }catch(err){

    }
  }, []);

  return (
    <div style={{ margin: "2rem" }}>
      <h1 className="text-center mb-4">Log In</h1>
      <Row>
        <Col xs={0} md={3}></Col>
        <Col xs={12} md={6}>
          <Form onSubmit={submitFormHandler}>
            <Form.Group className="mx-5 mb-3" controlId="formBasicEmail">
              <Form.Label
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
                Aadhaar Number
              </Form.Label>
              <Form.Control
                type="aadhaar"
                placeholder="Enter Aadhaar Number"
                value={aadhaar}
                onChange={(e) => {
                  setaadhaar(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mx-5" controlId="formBasicPassword">
              <Form.Label
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
                OTP
              </Form.Label>
              <Row>
                <Col md={8}>
                  <Form.Control
                    type="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      setotp(e.target.value);
                    }}
                  />
                </Col>

                <Col md={4}>
                  <Button variant="primary" type="submit">
                    Send OTP
                  </Button>
                </Col>
              </Row>
            </Form.Group>
            <Button className="m-4" variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
        <Col xs={0} md={3}></Col>
      </Row>
    </div>
  );
};

export default Login;
