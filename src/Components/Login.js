import React, { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import compiledElection from "./../ethereum/build/Election.json";
import web3 from "./../web3";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getDatabase, ref, child, get } from "firebase/database";

const Login = (props) => {
  const [aadhaar, setaadhaar] = useState("");
  const [otp, setotp] = useState("");
  const [partyData, setPartyData] = useState(null);
  const [err, setErr] = useState(null);

  const submitFormHandler = (e) => {
    e.preventDefault();

    window.confirmationResult.confirm(otp).then((result) => {
      const user = result.user;
      console.log("Success");
    }).catch((error) => {
      console.log(error);
    });
  };

  const sendOtpHandler = async (e) => {
    e.preventDefault();

    const database = getDatabase();
    const dbRef = ref(database);
    get(child(dbRef, `${aadhaar}/number`)).then((snapshot)=>{
      console.log(snapshot);
      if(snapshot.exists()){
        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
          'size': 'normal',
          'callback': (response) => {
            console.log(response);

            const appVerifier = window.recaptchaVerifier;

            signInWithPhoneNumber(auth, snapshot.val(), appVerifier)
              .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
              }).catch((error) => {
                console.log(error);
              });

          },
          'expired-callback': () => {
            console.log("expired")
          }
        }, auth);
        window.recaptchaVerifier.render();
      }
      else{
        console.log("Invalid aadhar");
      }
    });

  };

  const address = props.match.params.address;
  const index = props.match.params.id;

  useEffect(async () => {
    try {
      const election = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledElection.abi)),
        address
      );

      const party = await election.methods.getPartyDetails(index).call();
      setPartyData(party);
    } catch (err) {
      setErr(err);
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Row>
        <Col
          xs={12}
          md={4}
          className="border-right my-2 col d-flex justify-content-center"
        >
          {partyData ? (
            <div>
              <br />
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  style={{ width: "17rem", height: "17rem", margin: "auto" }}
                  variant="top"
                  src={partyData.image}
                  className="p-2"
                />
                <Card.Body>
                  <Card.Title>{partyData.name}</Card.Title>
                  <Card.Text>
                    Lead By{" "}
                    <b style={{ color: "#e0e0e0" }}> {partyData.leaderName}</b>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ) : null}
        </Col>
        <Col xs={12} md={8}>
          <br />
          <br />
          <h2 className="text-center mb-4">Enter Credentials</h2>
          <Form onSubmit={submitFormHandler}>
            <Form.Group className="mx-5 mb-3" controlId="formBasicEmail">
              <Row>
                <Col md={7}>
                  <Form.Label
                    style={{
                      backgroundColor: "#f3ec78",
                      backgroundImage:
                        "linear-gradient(45deg, #f3ec78, #af4261)",
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
                    required
                    placeholder="Enter Aadhaar Number (eg. 012345678901)"
                    value={aadhaar}
                    onChange={(e) => {
                      setaadhaar(e.target.value);
                    }}
                  />
                </Col>

                <Col md={5} className="mt-3">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => sendOtpHandler(e)}
                  >
                    Send OTP
                  </Button>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mx-5" controlId="formBasicPassword">
              <Row>
                <Col md={7}>
                  <Form.Label
                    style={{
                      backgroundColor: "#f3ec78",
                      backgroundImage:
                        "linear-gradient(45deg, #f3ec78, #af4261)",
                      backgroundSize: "100%",
                      WebkitBackgroundClip: "text",
                      MozBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      MoxTextFillColor: "transparent",
                    }}
                  >
                    OTP
                  </Form.Label>
                  <Form.Control
                    type="otp"
                    required
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      setotp(e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>
            <Button className="m-4" variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          <Row>
            <div id="recaptcha"></div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
