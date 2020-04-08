import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../contexts'
import {
  randAlert,
  leveling,
  getProfile,
  editProfile,
  getMyRoom,
  getFollower,
  postFollowing,
  deleteFollowing
} from '../../helpers'
import './Profile.scss'

import { FaHeartBroken, FaPen, FaAngleLeft, FaAngleRight, FaSave, FaUserPlus, FaUserCheck } from 'react-icons/fa'
import { Card, Popup } from '../../components'
import { profiles, gems } from '../../img/Profile'

export default () => {
  const { user_id } = useParams()
  const [profile, setProfile] = useState({})
  const [roomList, setRoomList] = useState([])
  const [auth, setAuth] = useContext(AuthContext)
  const [edit, setEdit] = useState({ ediable: false })
  const [rank, setRank] = useState({})
  const [follow, setFollow] = useState(null)
  const [follower, setFollower] = useState([])
  const [popup, setPopup] = useState('')

  useEffect(() => {
    if (user_id === auth.data.user_id) {
      setEdit({ ediable: true })
    }
    getProfile(user_id)
      .then(res => {
        const { user, error } = res.data
        if (user) {
          setRank(leveling(user.likes))
          setProfile(user)
          if (user.role) {
            getFollower(user_id)
              .then(res => {
                const { followers, error } = res.data
                if (followers) {
                  setFollower(followers)
                  if (followers.find(follower => follower.student_id === auth.data.user_id)) {
                    setFollow(true)
                  }
                } else {
                  setPopup({ type: 'alert', title: randAlert(), text: error })
                }
              })
          }
        } else {
          setPopup({ type: 'alert', title: randAlert(), text: error })
        }
      })
    getMyRoom({ user_id })
      .then(res => {
        const { rooms, error } = res.data
        if (rooms) {
          setRoomList(rooms)
          setPopup('')
        } else {
          setPopup({ type: 'alert', title: randAlert(), text: error })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id])

  const changeProfile = action => {
    if (action === 'left') {
      let new_icon = profile.profile_icon - 1
      if (new_icon < 0) new_icon = 9
      setProfile({ ...profile, profile_icon: new_icon })
    } else {
      let new_icon = profile.profile_icon + 1
      if (new_icon > 9) new_icon = 0
      setProfile({ ...profile, profile_icon: new_icon })
    }
  }
  const saveProfile = () => {
    setPopup('loading')
    editProfile(profile)
      .then(res => {
        const { user, error } = res.data
        if (user) {
          setEdit({ ediable: true })
          setAuth({ ...auth, data: profile })
          setPopup({ type: 'alert', title: randAlert(), text: user.name })
          setPopup('')
        } else {
          setPopup({ type: 'alert', title: randAlert(), text: error })
        }
      })
  }
  const handleFollow = () => {
    if (follow) {
      setFollow(false)
      deleteFollowing(auth.data, user_id)
        .then(res => {
          const { success, error } = res.data
          if (success) {
            console.log('Unfollow!')
          } else {
            setPopup({ type: 'alert', title: randAlert(), text: error })
            setFollow(true)
          }
        })
    } else {
      setFollow(true)
      postFollowing(auth.data, user_id)
        .then(res => {
          const { success, error } = res.data
          if (success) {
            console.log('Follow!')
          } else {
            setPopup({ type: 'alert', title: randAlert(), text: error })
            setFollow(false)
          }
        })
    }
  }
  const handlePassword = value => setProfile({ ...profile, password: value })
  const handleName = value => setProfile({ ...profile, name: value })

  return (
    <div id="profile-page-bg">
      <div id="profile-page-content">

        <section id="user-card">
          <div style={{ position: 'relative' }}>
            <img id="user-picture" className={rank.color} src={profiles[profile.profile_icon]} alt="" />
            {edit.ediable &&
              <div id="user-edit-btn" onClick={() => setEdit({ editing: true })}><FaPen style={editBtn} /></div>}
            {edit.editing &&
              <div id="user-pic-left" onClick={() => changeProfile('left')}><FaAngleLeft style={editBtn} /></div>}
            {edit.editing &&
              <div id="user-pic-right" onClick={() => changeProfile('right')}><FaAngleRight style={editBtn} /></div>}
            {edit.editing &&
              <div id="user-edit-btn" onClick={() => {
                if (profile.name !== '') setPopup('password')
                else setPopup({ type: 'alert', title: randAlert(), text: 'You must enter your name' })
              }
              }><FaSave style={editBtn} /></div>}
            {(user_id !== auth.data.user_id && profile.role) && (
              (follow && <div className='user-follow-btn active' onClick={handleFollow}><FaUserCheck style={editBtn} /></div>) ||
              (!follow && <div className='user-follow-btn' onClick={handleFollow}><FaUserPlus style={editBtn} /></div>)
            )}
          </div>
          {!edit.editing && <header id="user-name">{profile.name || 'Loading'}</header>}
          {edit.editing &&
            <input
              id="user-name-edit"
              value={profile.name}
              onChange={e => handleName(e.target.value)}
              minLength="1"
            />}
          <label id="user-role">{profile.role === true && 'TEACHER'}</label>
          <label id="user-role">{profile.role === false && 'STUDENT'}</label>
          <label id="user-level">
            LV {rank.lv}
            {profile.role === true && <span className={`color ${rank.color}`}> {rank.title}</span>}
            {profile.role === false && <span className="color green"> Learner</span>}
          </label>
          <div id="user-expbar">
            <div id="user-gem" className={rank.color}>
              <img src={gems[rank.color]} alt="" />
            </div>
            <div id="user-expbar-progress" className={'bg ' + rank.color} style={{ width: rank.percent }}></div>
          </div>
          <span id="user-fam">
            {
              profile.role &&
              <div className="user-fam-box">
                <label className="user-fam-number">{profile.likes}</label>
                <label className="user-fam-title">Heart{profile.likes > 1 && 's'}</label>
              </div>
            }
            <div className="user-fam-box">
              <label className="user-fam-number">{follower.length}</label>
              <label className="user-fam-title">Follower{follower.length > 1 && 's'}</label>
            </div>
          </span>
        </section>

        <section id="user-own-room">
          {roomList.map((room, index) => <Card key={index} room={room} />)}
        </section>

      </div>

      {popup === 'loading' &&
        <Popup
          type="loading"
          text="Loading"
        />}
      {popup.type === 'alert' &&
        <Popup
          type="alert"
          Icon={FaHeartBroken}
          title={popup.title}
          text={popup.text}
          confirm="Okay"
          onConfirm={() => setPopup('')}
        />}
      {popup === 'password' &&
        <Popup
          type="password"
          title="Is that you?"
          confirm="It's me!"
          cancel="Not sure"
          onChange={handlePassword}
          onConfirm={saveProfile}
          onCancel={() => setPopup('')}
        />}
    </div >
  )
}

const editBtn = {
  fontSize: '24px',
  color: 'white',
}