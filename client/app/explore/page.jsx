'use client'

import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../../context'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'

const ExplorePage = () => {
    const router = useRouter();
    const [allUsers, setAllUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const { otherUser, setOtherUser } = useGlobalContext();

    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, allUsers]);

    const fetchAllUsers = async () => {
        try {
            let result = await fetch("http://localhost:5000/user")
            result = await result.json()
            if (result.status && Array.isArray(result.user)) {
                setAllUsers(result.user);
                setFilteredUsers(result.user);
            }
        } catch (err) {
            console.error("Error fetching users:", err)
        }
    }

    const filterUsers = () => {
        const filtered = allUsers.filter(user => 
            user && user.name && typeof user.name === 'string' &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }

    const handleOtherUser = async (name) => {
        try {
            let result = await fetch("http://localhost:5000/user/other-user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name }),
                credentials: 'include'
            })
            result = await result.json();
            if (result.status) {
                setOtherUser(result.user)
                router.push(`profile/${name}`)
            }
        } catch (err) {
            console.error("Error fetching other user:", err)
        }
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }

    return (
        <div>
            <Navbar />
            <div className='flex flex-col items-center justify-items-center p-4'>
            
            <h1 className='text-2xl font-bold mb-4'>Explore Users</h1>
            
            <div className='mb-4 w-full max-w-md'>
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className='w-full p-2 border border-gray-300 rounded-md'
                />
            </div>

            <div className='w-full max-w-md'>
                {filteredUsers.map((el, i) => (
                    el && el.name ? (
                        <div 
                            key={i} 
                            className='flex items-center gap-2 mb-2 p-2 hover:bg-gray-100 rounded cursor-pointer' 
                            onClick={() => handleOtherUser(el.name)}
                        >
                            <img src={el.picture} alt="" className='w-10 h-10 rounded-full object-cover'/>
                            <p className='font-semibold'>{el.name}</p>
                        </div>
                    ) : null
                ))}
                
                {filteredUsers.length === 0 && (
                    <p className='text-center text-gray-500'>No users found</p>
                )}
            </div>
        </div>
        </div>
        
    )
}

export default ExplorePage