import { useState, useEffect } from 'react';
import './App.css'
import { FormControl, FormHelperText, Input, InputLabel, Button } from '@material-ui/core';
import {Accordion, AccordionSummary, Typography, AccordionDetails } from '@material-ui/core';
import { Table, TableBody, Paper, TableContainer, TableHead, TableRow, TableCell, TableFooter } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';  

function App() {
  const CONVERSION_FACTOR = 250
  const resultStyle = {fontWeight: 800}
  const [aircons, setAircons] = useState([])
  const [api, setApi] = useState('/api/products/1')
  const [expanded, toggleExpanded] = useState(false)
  const [averageCubicWeight, setResult] = useState('Not Calculated Yet')
  const calculate = ()=>{
    const base = document.getElementById('my-input').value
    if(base==='')
      return
    else toggleExpanded(true)
    const url = base+api
    axios.get(url)  
      .then(res => {  
        const acs = res.data.objects.filter(obj=>obj.category==="Air Conditioners");
        acs.forEach(ac=>{
          let obj = {}
          obj.cubicWeigth = ac.size.width*ac.size.height*ac.size.length*CONVERSION_FACTOR/1000000
          obj.title = ac.title
          setAircons(oldArray => [...oldArray, obj])
        })
        if(res.data.next){
          setApi(res.data.next)
        }

      })
      .catch(err=>{
        console.log(err)
        alert(err)
      })
  }
  useEffect(() => {
    calculate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api])
  useEffect(()=>{
    let avg = 0
    aircons.forEach((ac)=>{
      avg+=ac.cubicWeigth
    })
    avg/=aircons.length
    setResult(avg)
  }, [aircons])

  return (
    <div className="App">
      <FormControl fullWidth>
        <InputLabel htmlFor="my-input">API Base URL</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text">Paste the API's base URL here (no '/' at the end).</FormHelperText>
        <Button variant = 'outlined' color = 'primary' onClick={calculate}>Find and Calculate</Button>
      </FormControl>
      <Accordion className="Acc" expanded={expanded} onChange={(event, expanded)=>{toggleExpanded(expanded)}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        <Typography >Air Conditionars</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table aria-label="results">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Cubic Weight</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                aircons.map((ac, i)=><TableRow key={i}>
                  <TableCell component="th" scope="row">{ac.title}</TableCell>
                  <TableCell align="right">{ac.cubicWeigth}</TableCell>
                </TableRow>)}
              </TableBody>
              <TableFooter >
                  <TableCell style={resultStyle} component="th" scope="row">Average Cubic Weight</TableCell>
                  <TableCell style={resultStyle} align="right">{averageCubicWeight}</TableCell>
              </TableFooter>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default App;
