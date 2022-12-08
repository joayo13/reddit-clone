/* eslint-disable react/prop-types */
import React from 'react'

function Notifications (props) {
  return (
    <ul className='mobileNav w-40 md:w-80 flex flex-col justify-evenly absolute right-4 top-overflow-hidden bg-white dark:bg-gray-900 dark:text-white rounded-md z-10 border border-gray-200 dark:border-gray-700 text-sm font-medium '>
    {props.notifications.map((notification, index) => <li key={index}>{notification.message}</li>)}
    </ul>
  )
}

export default Notifications
