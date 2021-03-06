import React from 'react'
import moment from 'moment'
import './Card.scss'

import { FaLock, FaTrashAlt, FaPen, FaCog } from 'react-icons/fa'
import { TiHeart } from 'react-icons/ti'
import { subjects } from '../../img/subject'

export const Card = ({ room, onClick, editable, onEdit, onDelete }) => {
  return (
    <div className="course-card" onClick={onClick && (() => onClick(room))}>
      {editable &&
        <span className="card-btn" onClick={e => e.stopPropagation()}>
          <FaCog className="card-btn-icon-cog" onClick={e => e.stopPropagation()} />
          <FaPen className="card-btn-icon" onClick={e => { e.stopPropagation(); onEdit(room) }} />
          <FaTrashAlt className="card-btn-icon" onClick={e => { e.stopPropagation(); onDelete(room) }} />
        </span>}
      <img src={subjects[room?.subject]} className="course-cover" alt="" />
      <section className="course-detail">
        <div className="card-course-header">
          <h5 className="course-name">
            {room?.private && <FaLock style={lock} />}
            {room?.name}
          </h5>
          <p className="course-teacher">by {room?.teacher_name}</p>
        </div>
        <footer className="course-footer">
          <p className="course-date">
            {moment(new Date(room?.date_created)).format("LL")}
          </p>
          <div style={like}>
            <TiHeart style={heart} />
            {room?.likes}
          </div>
        </footer>
      </section>
    </div>
  )
}

const like = {
  display: 'flex',
  alignItems: 'center'
}

const heart = {
  fontSize: '22px',
  color: '#ff0062',
  marginRight: '5px'
}

const lock = {
  fontSize: '16px',
  marginRight: '5px',
  color: 'grey'
}