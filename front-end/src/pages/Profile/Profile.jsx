//HOOKS
import {useEffect, useState, useContext} from "react"

// USER MADE COMPONENTS
import Appbar from "../../components/Appbar/Appbar"

// MATERIAL UI
import Brightness4Icon from '@mui/icons-material/Brightness4';
import IconButton from '@mui/material/IconButton';

// AXIOS
import Axios from "axios";

// TOAST
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//CSS
import "./Profile.css"
import Button from "@mui/material/Button";
import {ContextTheme} from "../../App";
import useLocalPhoto from "../../hooks/useLocalPhoto";


export default function Profile() {

    const [department, setDepartment] = useState("");
    const [statusUser, setStatusUser] = useState("");
    const [email, setEmail] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [themeDetails, setThemeDetails] = useContext(ContextTheme);

    const profilePic = useLocalPhoto(email.split("@")[0])


    useEffect(() => {

        const account = JSON.parse(localStorage.getItem("myAccount"))
        setEmail(account.data.email);
        Axios.get("http://localhost:8085/department/" + account.data.idDepartment).then((response) => {
            setDepartment(response.data.name)
        })
        Axios.get("http://localhost:8085/statusUser/" + account.data.idStatus).then((response) => {
            setStatusUser(response.data.name)
        })

    }, [])

    const insertImage = async () => {

        if (selectedImage) {
            const formData = new FormData();

            formData.append('image', selectedImage, email.split('@')[0] + ".jpg");

            await Axios.post("http://localhost:8085/other/uploadImage",
                formData
                , {
                    headers: {'Content-Type': 'multipart/form-data'}
                })
            console.log(selectedImage)
            window.location.reload(false);

        } else {
            toast.error("Must upload image!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const setBlueTheme = () => {
        const palette = {
            "palette": {
                "primary": {
                    "main": "#2771ee",
                    "contrastText": "#fff"
                },
            }
        }

        setThemeDetails(palette)
        localStorage.setItem("theme", JSON.stringify(palette))
    }

    const setOrangeTheme = () => {
        const palette = {
            "palette": {
                "primary": {
                    "main": "rgba(245, 166, 35, 1)",
                    "contrastText": "#fff"
                },
            }
        }
        setThemeDetails(palette)
        localStorage.setItem("theme", JSON.stringify(palette))
    }

    const setGreenTheme = () => {
        const palette = {
            "palette": {
                "primary": {
                    "main": "#009142",
                    "contrastText": "#fff"
                },
            }
        }

        setThemeDetails(palette)
        localStorage.setItem("theme", JSON.stringify(palette))
    }

    const setPurpleTheme = () => {
        const palette = {
            "palette": {
                "primary": {
                    "main": "rgba(102, 13, 179, 1)",
                    "contrastText": "#fff"
                },
            }
        }

        setThemeDetails(palette)
        localStorage.setItem("theme", JSON.stringify(palette))
    }

    const setDarkBlueTheme = () => {
        const palette = {
            "palette": {
                "primary": {
                    "main": "rgba(38,102,215,0.90)",
                    "contrastText": "#fff"
                },
                "mode": "dark"
            }
        }

        setThemeDetails(palette)
        localStorage.setItem("theme", JSON.stringify(palette))
    }

    return (
        <>
            <Appbar/>

            <div className="profile_layout">
                <div className="panel_title">
                    Profile
                </div>
                <div className="profile_card">
                    <div className="profile_card_details">

                        <div className="circle_profile_photo">
                            <img
                                src={profilePic}
                                className="profile_photo"
                                alt="ProfilePicture"
                            />
                        </div>

                        <div className="account_details">
                            <p><b>Email:</b> {email}</p>
                            <p><b>Department:</b> {department}</p>
                            <p><b>Status:</b> {statusUser}</p>
                        </div>
                    </div>
                    <div className="color_mode">
                        <p> Light Mode Themes </p>
                        <div className="light_mode_themes">
                            <div className="orange_light_theme" onClick={setOrangeTheme}/>
                            <div className="blue_light_theme" onClick={setBlueTheme}/>
                            <div className="green_light_theme" onClick={setGreenTheme}/>
                            <div className="purple_light_theme" onClick={setPurpleTheme}/>
                        </div>
                        <p className="title_dark_mode"> Dark Mode</p>
                        <div className="dark_mode">

                            <IconButton sx={{backgroundColor: "wheat"}} onClick={setDarkBlueTheme}>
                                <Brightness4Icon/>
                            </IconButton>


                        </div>
                    </div>
                    <div className="image_changer_container">
                        <input type="file" accept=".png, .jpg, .jpeg" name='image' id='image' onChange={(e) => {
                            setSelectedImage(e.target.files[0]);
                            console.log(e.target.files[0])
                        }}/>
                        <Button variant="contained" sx={{marginBottom: 2}} onClick={insertImage}>Change image</Button>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
}
