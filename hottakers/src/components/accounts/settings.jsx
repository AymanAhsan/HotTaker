import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useUser } from './UserContext';
import SettingsSidebar from '../utility/settings_sidebar';
import AccountSettings from './settings/AccountSettings';
import ProfileSettings from './settings/ProfileSettings';
import '../../css/settings.css';
import axios from 'axios';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('account');

    const renderSection = () => {
        switch (activeSection) {
            case 'account':
                return <AccountSettings />;
            case 'profile':
                return <ProfileSettings/>;
            case 'password':
                return <div>Password Settings</div>;
            case 'notifications':
                return <div>Notifications Settings</div>;
            case 'privacy':
                return <div>Privacy Settings</div>;
            case 'security':
                return <div>Security Settings</div>;
            case 'apps':
                return <div>Apps Settings</div>;
            case 'deactivate':
                return <div>Deactivate Account</div>;
            default:
                return <div>Account Settings</div>;
        }
    }

    return (
        <div className="settings-container">
            <SettingsSidebar setActiveSection={setActiveSection}/>
            <div className="settings-content">
                <h1>Settings</h1>
                {renderSection()}
            </div>
        </div>
    );
}

export default Settings;