import React, { useState } from 'react';
import './Teach.scss';
import { Input, Dropdown, ToggleButton, Button } from '../../components';

export const Teach = ({ history, user }) => {
  const [room, setRoom] = useState("")
  const [link, setLink] = useState("")
  
  const handleSubmit = e => {
    e.preventDefault();
    history.push(`/room?name=${user.name}&room_id=${room}&link=${link}`)
  }

  return (
    <div className="teach-page-bg">
      <div className="teach-content">
        <div className="teach-form">

          <header>Create Room</header>
          <form onSubmit={handleSubmit}>
            <Input text="Room Name" type="text" onChange={setRoom} required/>
            <div className="tag-group">
              <Dropdown id="main" menus={['Science']}/>
              <Dropdown id="sub" menus={['Physics', 'Chemistry', 'Biology']}/>
            </div>
            <Input text="Embed Link" type="text" onChange={setLink} required/>
            <div className="private-group">
              <Dropdown id="num" menus={[2, 3, 4, 5]}/>
              <ToggleButton on="Private" off="Public"/>
            </div>
            <Button alt text="Create" type="submit"/>
          </form>

        </div>
      </div>
    </div>
  );
}