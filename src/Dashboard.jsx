import { useEffect, useState } from 'react';
import {Container, Button,Form,Row,Modal,Table,Spinner } from 'react-bootstrap';
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';

export default function Dashboard(){

    
    const API_MENTOR='https://siva-assign-mentor.herokuapp.com/mentor';
    const API_STUDENT='https://siva-assign-mentor.herokuapp.com/student';
    const authToken=localStorage.getItem('auth-token');
    const [mentors,setMentors]=useState([]);
    const [students,setStudents]=useState([]);
    const [mode,setMode]=useState('mentor');
    const [add,setAdd]= useState(false);
    const [assign,setAssign]= useState(false);
    const [name,setName]=useState('');
    const [loading,setLoading]=useState(false);
    const [added,setAdded]=useState(false);
    const [studentList,setStudentList]=useState([]);
    const [selected,setSelected]=useState([]);
    const [id,setId]=useState();

    const handleShow=(mode)=>{
        setMode(mode);
        setAdd(true);
    }
    const handleAssignShow=(mode,id)=>{
        setMode(mode);
        setId(id);
        setAssign(true);
    }
    const handleClose=()=>setAdd(false);
    const handleAssignClose=()=>setAssign(false);

    const handleInput=({target:{value}})=>setName(value);

    const handleCheckChanged=({target:{name,value,checked}})=>{
        if(mode==='student') {
            if (checked===true) {
                if (!selected.includes(value)) selected.push(value);
            } else {
               const selectedValue=svalue=>svalue===value;
               const index=selected.findIndex(selectedValue);
               selected.splice(index,1);
            }
        } else {
            setSelected(value);
        }
    }

    const addMentorStudent=async(e)=>{
        e.preventDefault();
        let API_USE=API_MENTOR;
        if (mode==='student') API_USE=API_STUDENT;
        setLoading(true);
        await axios.post(API_USE,
            {name:name}).then(function(res){
            if(res.data) if(res.status===200) {
                setLoading(false); 
                handleClose();
                toast.success(`New ${mode} added successfully`);
                setAdded(!added);
            } }).catch(function(err){
            setLoading(false);
            });
            setLoading(false);
        }

        const assignMentorStudent=async(e)=>{
            e.preventDefault();
            let API_USE=API_STUDENT;
            if (mode==='student') API_USE=API_MENTOR;
            setLoading(true);
            console.log(API_USE);
            await axios.put(`${API_USE}/assign`,
                {id:id,value:selected}).then(function(res){
                if(res.data) if(res.status===200) {
                    setLoading(false); 
                    handleAssignClose();
                    toast.success(`New ${mode} assigned successfully`);
                    setSelected([]);
                    setId('');
                    setAdded(!added);
                } }).catch(function(err){
                setLoading(false);
                });
                setLoading(false);
        }

        const deleteMentorStudent=async(mode,id)=>{
            setLoading(true);
            let API_USE=API_MENTOR;
            if (mode==='student') API_USE=API_STUDENT;
            await axios.delete(`${API_USE}/${id}`).then(function(res){
                if(res.data) if(res.status===200) {
                    setLoading(false);
                    setAdded(!added);
                    toast.success(`Selected ${mode} deleted succesfully`);
                } }).catch(function(err){
                setLoading(false);
                });
                setLoading(false);
        }

        useEffect(()=>{
           
            setLoading(true);
            async function getMentors() {
            await axios.get(API_MENTOR,
                ).then(function(res){
                if(res.data) if(res.status===200) {
                    setLoading(false);
                    console.log('mentors',res.data);
                    setMentors(res.data);
                    handleClose();
                } }).catch(function(err){
                setLoading(false);
                });
            }

            async function getStudents() {
                await axios.get(API_STUDENT,
                    ).then(function(res){
                    if(res.data) if(res.status===200) {
                        setLoading(false);
                        console.log('students',res.data);
                        setStudents(res.data);
                        handleClose();
                    } }).catch(function(err){
                    setLoading(false);
                    });
                }

                async function getStudentsWithoutMentor() {
                    await axios.get(`${API_STUDENT}/swom`,
                        ).then(function(res){
                        if(res.data) if(res.status===200) {
                            setLoading(false);
                            console.log('students',res.data);
                            setStudentList(res.data);
                            handleClose();
                        } }).catch(function(err){
                        setLoading(false);
                        });
                    }

            getMentors();
            getStudents();
            getStudentsWithoutMentor();

            setLoading(false);

        },[authToken,added])

    return (
        <Container style={{padding:'10px'}}>
            <ToastContainer/>
            <h2>Assign mentor</h2> 
            <Row style={{padding:'10px'}}>
                </Row >
                <Container>
              
                </Container>
                <Row>         
                <h4>Mentors</h4>
                <Row style={{padding:'10px'}}>
                <Button style={{width:'10rem',marginRight:'10px'}} onClick={()=>{handleShow('mentor')}}>Add new</Button>
                <Button style={{width:'10rem',marginRight:'10px'}} onClick={()=>setAdded(!added)}>
                    {loading?<Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        />:<></>}
                    Refresh</Button>
                </Row>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Students</th>
                    {/* <th>Assign</th> */}
                    <th colSpan="2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {mentors.map((mentor,index)=>{
                    return(
                        <tr key={index}>
                            <th>{mentor.name}</th>
                            <th>{mentor.students.map((student,index)=>{return <p key={index}>{student}</p>})}</th>
                            {/* <th>{mentor.hits}</th> */}
                            <th><Button style={{marginRight:'10px'}} onClick={()=>handleAssignShow('student',mentor._id)} variant="primary">Assign student</Button>
                            <Button style={{marginRight:'10px'}} onClick={()=>deleteMentorStudent('mentor',mentor._id)} variant="danger">
                            {loading?<Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"/>:<></>}
                            Delete</Button></th>
                        </tr>
                    )
                })}
            </tbody>
        </Table>

        {/* Students */}
        <h4>Students</h4>
        <Row style={{padding:'10px'}}>
        <Button style={{width:'10rem',marginRight:'10px'}} onClick={()=>{handleShow('student')}}>Add new</Button>
        <Button style={{width:'10rem',marginRight:'10px'}} onClick={()=>setAdded(!added)}>
            {loading?<Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                />:<></>}
            Refresh</Button>
        </Row>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Mentor</th>
                    {/* <th>Assign</th> */}
                    <th colSpan="2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {students.map((student,index)=>{
                    return(
                        <tr key={index}>
                            <th>{student.name}</th>
                            <th>{student.mentor}</th>
                            {/* <th>{student.hits}</th> */}
                            <th><Button style={{marginRight:'10px'}} onClick={()=>handleAssignShow('mentor',student._id)} variant="primary">Assign mentor</Button>
                            <Button style={{marginRight:'10px'}} onClick={()=>deleteMentorStudent('student',student._id)} variant="danger">
                            {loading?<Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"/>:<></>}
                            Delete</Button></th>
                        </tr>
                    )
                })}
            </tbody>
        </Table>

        </Row>
            
            {/*Add modal */}
            <Modal show={add} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <h3>Add {mode}</h3>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                        <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={name} name="name" onChange={handleInput}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                        <Row style={{padding:'10px'}}>
                        <Button onClick={addMentorStudent} type="submit">
                            {loading?<Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />:<></>}
                            Add {mode}</Button>
                        </Row>
                        </Form.Group>
                        </Form>
            </Modal.Body>
        </Modal>

         {/*Assign modal */}
         <Modal show={assign} onHide={handleAssignClose}>
                        <Modal.Header closeButton>
                            <h3>Assign {mode}</h3>
                        </Modal.Header>
                        <Modal.Body>
                        <Form>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        {mode==='student'?studentList.map((student,index)=>{
                             return <Form.Check key={index} onChange={handleCheckChanged} type="checkbox" label={student.name} value={student.name} name={student.name} />
                        }):mentors.map((mentor,index)=>{
                            return <Form.Check key={index} onChange={handleCheckChanged} type="radio" label={mentor.name} value={mentor.name} name="radioButtonSelect" />})}
                        </Form.Group>
                        <Form.Group>
                        <Row style={{padding:'10px'}}>
                        <Button onClick={assignMentorStudent} type="submit">
                            {loading?<Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />:<></>}
                            Assign {mode}</Button>
                        </Row>
                        </Form.Group>
                        </Form>
            </Modal.Body>
        </Modal>

        </Container>



    )
}