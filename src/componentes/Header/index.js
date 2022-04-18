import './header.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import {EnviaWhats, RedirectInsta, RedirectLink} from '../IconesContatos';
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import { Link } from 'react-router-dom';


export default function Header() {
    const { user, signOut } = useContext(AuthContext);
    
    const [show, setShow] = useState(true);


    function handleHeader() {
        const menu = document.querySelector('.sidebar');
        menu.classList.toggle('min-sidebar');

        const red = document.querySelector('.redirect-btn');
        red.classList.toggle('min-redirect-btn');

        const content = document.querySelector('.content');
        content.classList.toggle('min-content');

        setShow(!show);


    }

    return(
        <div className='sidebar'>
           
            <div className='btn-troca'>
                <button onClick={()=>handleHeader()}>
                    {show  ? <BiChevronLeft size={24} color="white"/>
                            : <BiChevronRight size={24} color="white"/>}</button>
            </div>

            <div className='foto'>
                <img 
                src={user.avatarUrl == null ? avatar : user.avatarUrl} 
                alt="foto avatar" />
            </div>

            <Link to="/dashboard">
                <FiHome size={24} color="white" />
               <p> Chamados</p>
            </Link>
            {user.tipo === 'admin' &&
            <Link to="/customers">
                <FiUser size={24} color="white" />
                <p>Clientes</p>
            </Link>
            }

            <Link to="/profile">
                <FiSettings size={24} color="white" />
                <p>Configurações</p>
            </Link>
            
            
            <Link onClick={ () => signOut() } >
                <FiLogOut size={24} color="white" />
                <p>Sair</p>
            </Link>

            <div className='redirect-btn'>
            <EnviaWhats />
            <RedirectInsta/>
            <RedirectLink/>
            </div>
        
            

        

            
        </div>
    )

}