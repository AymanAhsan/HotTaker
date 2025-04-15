import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from '../accounts/UserContext';
import '../../css/settings_sidebar.css';
import axios from 'axios';


//Fix all importing, add new file structure for better organization
//Work on making all of the Setting states

const sections = [
    'account',
    'profile',
    'notifications',
    'privacy',
    'security',
    'apps',
];

const SettingsSidebar = ({setActiveSection}) => {
    const { user, isAuthenticated } = useUser();
    return (
        <aside className="sidebar">
            <nav>
            <ul>
                    {sections.map(section => (
                        <li key={section}>
                            <button className="sidebar-button" onClick={() => setActiveSection(section)}>
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default SettingsSidebar;