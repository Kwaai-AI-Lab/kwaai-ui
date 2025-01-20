import React from 'react';
import botAvatar from '../../assets/bot-avatar.png';
import './emptyMessage.css';

const EmptyMessage: React.FC = () => {
    return (
        <div className="empty-message">
            <img src={botAvatar} alt="Bot Avatar" />
            <span>Hmm, it’s empty here!</span>
            <span>Ready to create your first assistant?</span>
        </div>
    );
};

export default EmptyMessage;
