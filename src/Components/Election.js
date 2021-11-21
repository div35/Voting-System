import React from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const Election = () => {
  const data = [
    {
      name: "Bihar State Election",
      address: "axvt56jsgbe7j",
      totalVoteCount: "10",
      parties: [
        {
          name: "BJP",
          leader: "Mr. Modi",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/1200px-Bharatiya_Janata_Party_logo.svg.png",
        },
        {
          name: "AAP",
          leader: "Mr. Keju",
          image:
            "https://m.economictimes.com/thumb/msid-66428118,width-1200,height-900,resizemode-4,imgsize-94513/aap-agencies.jpg",
        },
        {
          name: "Congress",
          leader: "Mr. Papu",
          image: "https://m.media-amazon.com/images/I/61FXpKlb+HL._SL1500_.jpg",
        },
        {
          name: "Communist Party",
          leader: "Mr. Secular",
          image:
            "https://upload.wikimedia.org/wikipedia/en/8/8d/RCPI_flag_%28cropped_from_photo%29.jpg",
        },
      ],
    },
  ];
  const partiesCards = data.map((d) => {
    return (
      <Container>
        <Row>
          <Col></Col>
          <Col md="6">
            <h1 className="text-center">{d.name}</h1>
          </Col>
          <Col md="3">
            <Button variant="danger">Add Party</Button>
          </Col>
        </Row>
        <Row className="border-bottom rounded my-2 py-2">
          <Col className="my-1">
            <h4>Total Votes: {d.totalVoteCount} votes</h4>
          </Col>
          <Col></Col>
          <Col></Col>
          <Col>
            <Button variant="danger" type="submit">
              Declare Result
            </Button>
          </Col>
        </Row>
        <Row>
          {d.parties.map((p) => {
            return (
              <Col className="my-2 mx-1">
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
                        backgroundImage:
                          "linear-gradient(45deg, #f3ec78, #af4261)",
                        backgroundSize: "100%",
                        WebkitBackgroundClip: "text",
                        MozBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        MoxTextFillColor: "transparent",
                      }}
                    >
                      {p.name}
                    </Card.Title>
                    <Card.Text>Leader Name: {p.leader}</Card.Text>
                    <Button variant="primary">Cast Vote</Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  });
  return (
    <Container>
      <Row>{partiesCards}</Row>
    </Container>
  );
};

export default Election;
