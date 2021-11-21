import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import ElectionCard from "./ElectionCard";
import web3 from '../web3.js';

const factoryAddress = "0x99F81F365B7f9EEdB84b54af5C3aC6A163194feB";
const compiledFactory = require('../build/ElectionFactory.json');
const compiledElection = require('../build/Election.json');

const Elections = () => {
  const data = [
    {
      name: "Bihar State Election",
      address: "axvt56jsgbe7j",
      manager: "Mr. Satnam",
      parties: ["BJP", "AAP", "Congress", "Communist Party"],
    },
    {
      name: "Delhi State Election",
      address: "hfdb45jfdgk7y",
      manager: "Mr. Manoj",
      parties: ["AAP", "BJP", "Congress", "Cycle Party"],
    },
    {
      name: "Lok Sabha Election",
      address: "tfgb75ufdgk5y",
      manager: "Mr.Yogi",
      parties: ["AAP", "BJP", "Congress", "Mamta Party", "Faltu Party"],
    },
    {
      name: "Kasol City Election",
      address: "6fgd78ufdgk7y",
      manager: "Its Your Boy Jack",
      parties: [
        "Breezer Party",
        "Cocain Party",
        "Nasha Party",
        "Andhi Party",
        "Ganjha Party",
      ],
    },
  ];

  const [err, setErr] = useState(null); 
  const [electionsData, setElectionsData] = useState([]);
  useEffect(async ()=>{
    try{
      await window.ethereum.send('eth_requestAccounts');

      const accounts = await web3.eth.getAccounts();
			
      const contract = new web3.eth.Contract(
        JSON.parse(JSON.stringify(compiledFactory.abi)),
        factoryAddress
      );

      const elections = await contract.methods.getElections().call();
      setElectionsData(elections);
      console.log(elections);
    }catch(err){
      setErr(err);
      console.log(err);
    }


  }, [])

  return (
    <Container>
      <Row>
        <Col></Col>
        <Col md="6">
          <h1 className="text-center">Ongoing Elections</h1>
        </Col>
        <Col md="3">
          <Button variant="danger">Create Election</Button>
        </Col>
      </Row>
      <Container>
        {data.map((d) => (
          <ElectionCard data={d} />
        ))}
      </Container>
    </Container>
  );
};

export default Elections;
