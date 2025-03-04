import { createContext, useState, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (username, password) => {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    
        let data = await response.json();
    
        if (response.ok) {
            localStorage.setItem('authTokens', JSON.stringify(data));
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            navigate('/profile');
        } else {
            alert('Check login credentials: Something went wrong while logging in!');
        }
    };

    let logoutUser = () => {
        // e.preventDefault()
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        // navigate('/login')
    }

    const registerUser = async (phone, username, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                phone, username, password, password2
            })
        });
    
        let data = await response.json();
    
        if (response.status === 201) {
            navigate("/login");
    
            import("sweetalert2").then(Swal => {
                Swal.default.fire({
                    title: "Đăng ký thành công! Hãy đăng nhập",
                    icon: "success",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            });
        } else {
            console.error("Lỗi server:", response.status, data);
            alert("Lỗi đăng ký: " + JSON.stringify(data));
            import("sweetalert2").then(Swal => {
                Swal.default.fire({
                    title: `Lỗi ${response.status}: ${data.detail || "Đăng ký thất bại!"}`,
                    icon: "error",
                    toast: true,
                    timer: 6000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            });
        }
    };

    // const updateToken = async () => {
    //     const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type':'application/json'
    //         },
    //         body:JSON.stringify({refresh:authTokens?.refresh})
    //     })
       
    //     const data = await response.json()
    //     if (response.status === 200) {
    //         setAuthTokens(data)
    //         setUser(jwtDecode(data.access))
    //         localStorage.setItem('authTokens',JSON.stringify(data))
    //     } else {
    //         logoutUser()
    //     }

    //     if(loading){
    //         setLoading(false)
    //     }
    // }


    const updateToken = async () => {
        console.log("Đang kiểm tra refresh token..."); 
        console.log("authTokens hiện tại:", authTokens);
    
        if (!authTokens) {
            console.log("Không tìm thấy refresh token!");
            logoutUser();
            return;
        }
    
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: authTokens.refresh })
        });
    
        const data = await response.json();
    
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            console.log("Token cập nhật thành công!");
        } else {
            console.log("Refresh token thất bại, đăng xuất...");
            logoutUser();
        }
    
        setLoading(false);
    };

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
        registerUser: registerUser,
    }

    useEffect(()=>{
        if(loading){
            updateToken()
        }

        const REFRESH_INTERVAL = 1000 * 60 * 4 // 4 minutes
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}