import React from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

export const Navbar = () => {
    const [user] = useAuthState(auth);

    const signUserOut = async () => {
        await signOut(auth);
    }

    return (
        <div className="navbar">
            <div className="links">
                <Link to="/">Home</Link>
                {!user ? (
                    <Link to="/login">Login</Link>
                ) : (
                    <Link to="/createpost">Create Post</Link>
                )}
            </div>

            <div className="user"> 
                {user && (
                    <>
                        <button className="log-out-btn" onClick={signUserOut}> 
                            Log out 
                        </button>
                        <p> {user?.displayName || "no user"} </p>
                        <img src={user?.photoURL || ''} width="25" height="25" alt="user" />
                    </>
                )}
            </div>
        </div>
    );
}
