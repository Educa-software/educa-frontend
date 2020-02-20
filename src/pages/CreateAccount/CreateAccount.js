import React, { useState } from 'react';
import './CreateAccount.scss';
import { Input, Button } from '../../components';
import { Login } from "../Login/Login";

export const CreateAccount = () => {
  return (
    <div className="create-page-bg">
        <div className="create-content">
            <div className="create-form">
                <header>Create Account</header>
                <form onSubmit={ Login }>
                    <Input text="E-mail" type="text" required/>
                    <Input text="Name" type="text" required/>
                    <Input text="Password" type="password" required/>
                    <Button alt text="Create" type="submit" />
                    <br />
                </form>
                <footer>Already have account?</footer>

            </div>

        </div>
      
    </div>
  );
}