// HOOKS
import {useEffect, useState} from "react";

// USER MADE COMPONENTS
import Appbar from "../../components/Appbar/Appbar";
import PieChart from "../../components/PieChart/PieChart";

// TOAST
import "react-toastify/dist/ReactToastify.css";
import {toast, ToastContainer} from "react-toastify";

// MATERIAL UI
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Autocomplete} from "@mui/material";
import {StaticDateTimePicker} from '@mui/x-date-pickers/StaticDateTimePicker';


// TAGCLOUD
import {TagCloud} from 'react-tagcloud'

//DAYJS
import dayjs from 'dayjs';

// AXIOS
import Axios from "axios";


export default function Tasks() {

    const [tasks, setTasks] = useState([]);
    const [columns, setColumns] = useState([])
    const [arrayDescriptions, setArrayDescriptions] = useState([])
    const [editMode, setEditMode] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(0);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [deadline, setDeadline] = useState(dayjs(null));

    const [statusTasks, setStatusTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [users, setUsers] = useState([])

    const [selectedStatusTask, setSelectedStatusTask] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null)

    const [idStatusTask, setIdStatusTask] = useState(0)

    useEffect(() => {
        Axios.get("http://localhost:8085/task").then((response) => {
            setTasks(response.data)
            setColumns(Object.keys(response.data[0]))

            let arrayWords = [];
            for (let i = 0; i < response.data.length; i++) {
                let element = response.data[i];
                let arraySplittedWords = (element.name).split(" ")
                arrayWords.push(...arraySplittedWords)
            }
            setArrayDescriptions(arrayWords)
        })

        Axios.get("http://localhost:8085/statusTask").then((response) => {
            setStatusTasks(Array.from(response.data))

        })

        Axios.get("http://localhost:8085/project").then((response) => {
            setProjects(Array.from(response.data))
        })

        Axios.get("http://localhost:8085/user").then((response) => {
            setUsers(Array.from(response.data))
        })

    }, [])

    const finishedTasks = tasks.filter((element) => element.finishedTime)
    const unfinishedTasks = tasks.filter((element) => !element.finishedTime)

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false)
    }

    const openAddModal = () => {
        setEditMode(false);
        setOpen(true);

        //reset to default values
        setName("")
        setDescription("")
        setSelectedStatusTask(null);
        setSelectedUser(null);
        setSelectedProject(null);
        setDeadline(dayjs(''));
    }
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 550,
        height: 740,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        p: 4,
    };

    const editButtonCell = (params) => {
        return (
            <Button
                onClick={() => {
                    setSelectedTaskId(params.row.id)
                    setEditMode(true);
                    setName(params.row.name)
                    setDescription(params.row.description)
                    setSelectedProject(projects.find((project) => project.id === params.row.idProject))
                    setSelectedStatusTask(statusTasks.find((statusTask) => statusTask.id === params.row.idStatusTask))
                    setSelectedUser(users.find((user) => user.id === params.row.idUser))
                    setDeadline(dayjs(params.row.deadline))
                    setOpen(true);
                }}
                sx={{marginLeft: 1, backgroundColor: 'transparent', color: 'black', padding: '6px'}}
                startIcon={<ModeEditIcon/>}> </Button>
        )
    }

    const deleteButtonCell = (params) => {
        return (
            <Button variant="containted" startIcon={<DeleteIcon/>} onClick={() => {
                setSelectedTaskId(params.row.id);
                setOpenConfirmation(true);
            }} sx={{color: 'red'}}></Button>
        )
    }

    const columnsWithButton = [
        ...columns.map((column) => ({field: column, width: 160})),
        {field: "  ", renderCell: editButtonCell},
        {field: "   ", renderCell: deleteButtonCell}
    ];

    const [open, setOpen] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const addTask = () => {

        if (idStatusTask === 0) {
            setIdStatusTask(1);
        }

        if (name.length === 0) {
            toast.error("Name must be completed!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        } else if (!deadline || isNaN(deadline.unix())) {
            toast.error("Deadline must be completed!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        } else {

            Axios.post("http://localhost:8085/task/create", {
                name: name,
                description: description,
                idStatusTask: idStatusTask,
                idProject: selectedProject.id,
                deadline: deadline.format("YYYY-MM-DDTHH:mm"),
                idUser: selectedUser ? selectedUser.id : null
            })
            window.location.reload(false);

        }
    }

    const editTask = async () => {
        if (idStatusTask === 0) {
            setIdStatusTask(1);
        }

        if (name.length === 0) {
            toast.error("Name must be completed!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        } else if (!deadline || isNaN(deadline.unix())) {
            toast.error("Deadline must be completed!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        } else {

            Axios.put("http://localhost:8085/task/" + selectedTaskId, {
                name: name,
                description: description,
                idStatusTask: idStatusTask,
                idProject: selectedProject.id,
                deadline: deadline.format("YYYY-MM-DDTHH:mm"),
                idUser: selectedUser.id
            })
            window.location.reload(false);

        }
    }

    const deleteTask = () => {

        Axios.delete("http://localhost:8085/task/" + selectedTaskId);
        window.location.reload(false);
    }

    function createFrequencyArray(arr) {
        // const array = [];
        const frequencyArray = {}

        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];

            if (frequencyArray[element]) {
                frequencyArray[element]++;
            } else {
                frequencyArray[element] = 1;
            }
        }

        return Object.entries(frequencyArray).map(([key, value]) => ({value: key, count: value}));
    }

    return (
        <>
            <ToastContainer/>
            <Appbar/>
            <div className="panel_title">
                Tasks
            </div>
            <div className="mytasks_container_dataGrid">
                <div className="mytasks_dataGrid">
                    {columns.length > 0 ?

                        <DataGrid columns={columnsWithButton} rows={tasks} slots={{toolbar: GridToolbar}}
                        />
                        : <></>}
                </div>
            </div>
            <div className="users_buttons">
                <Button variant="contained" onClick={openAddModal}>Add Task</Button>
            </div>
            <div className="taskstats">
                <div className="card_homepage">
                    <div className="panel_title">
                        Status of the tasks
                    </div>
                    {unfinishedTasks.length > 0 || finishedTasks.length > 0 ?
                        <PieChart data1={finishedTasks} data2={unfinishedTasks}/> : <></>}
                </div>


                <div className="card_homepage">
                    <div className="panel_title">
                        Word Cloud
                    </div>
                    <TagCloud
                        minSize={12}
                        maxSize={35}
                        tags={createFrequencyArray(arrayDescriptions)}
                        onClick={(tag) => toast.info(` "${tag.value}" has appeared ${tag.count} times`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: false,
                            draggable: false,
                            progress: undefined,
                            theme: "light",
                        })}
                    />

                </div>
            </div>


            {/*Confirmation dialog for Delete*/}
            <Dialog
                open={openConfirmation}
                onClose={handleCloseConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you confirm deleting this task? "}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseConfirmation}>Decline</Button>
                    <Button onClick={deleteTask} autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/*Modal for Add / Edit*/}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {editMode ? <h3>Edit Task</h3> : <h3>Add Task</h3>}

                    <TextField
                        id="name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        label="Name"
                        variant="outlined"
                    />
                    <TextField
                        id="description"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        label="Description"
                        variant="outlined"
                    />

                    {projects.length > 0 ?
                        <Autocomplete
                            disablePortal
                            id="combo-box-projects"
                            options={projects}
                            getOptionLabel={(option) => option.name || ""}
                            sx={{width: 300}}
                            value={selectedProject}
                            onChange={(event, value) => {
                                setSelectedProject(value)
                            }}
                            renderInput={(params) => <TextField {...params} label="Projects"/>}
                        />
                        : <></>}

                    {statusTasks.length > 0 ?
                        <Autocomplete
                            disablePortal
                            id="combo-box-statusTasks"
                            options={statusTasks}
                            getOptionLabel={(option) => option.name || ""}
                            sx={{width: 300}}
                            value={selectedStatusTask}
                            onChange={(event, value) => {
                                setIdStatusTask(value.id)
                                setSelectedStatusTask(value)
                            }}
                            renderInput={(params) => <TextField {...params} label="Status Task"/>}
                        />
                        : <></>}

                    {users.length > 0 ?
                        <Autocomplete
                            disablePortal
                            id="combo-box-users"
                            options={users}
                            getOptionLabel={(option) => option.email || ""}
                            sx={{width: 300}}
                            value={selectedUser}
                            onChange={(event, value) => {

                                setSelectedUser(value)
                            }}
                            renderInput={(params) => <TextField {...params} label="User"/>}
                        />
                        : <></>}

                    <StaticDateTimePicker defaultValue={dayjs('2023-07-17T15:30')} orientation="landscape" disablePast
                                          ampm={false}
                                          value={deadline} onChange={(value) => {
                        setDeadline(value)
                    }}
                    />

                    {editMode ? <Button variant="contained" onClick={editTask}>Edit </Button> :
                        <Button variant="contained" onClick={addTask}>Add </Button>}
                </Box>

            </Modal>
        </>
    )
}