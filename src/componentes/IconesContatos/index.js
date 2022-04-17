import { FaWhatsapp, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import './iconesContatos.css';
import { AuthContext } from '../../contexts/auth';
import {useState, useContext} from 'react';



export default function WhatsappEnvio() {

   
}


export function EnviaWhats(){
    const { user } = useContext(AuthContext);
    return(
        <div>
            <a onClick={() => enviarMensagem(user)}>
                <FaWhatsapp size={20} color="#fff" />
            </a>
        </div>
    )
    
}

export function RedirectInsta(){
    return(
        <div>
            <a href="https://www.instagram.com/erleydiangelys" target="_blank">
                <FaInstagram size={20} color="#fff" />
            </a>
        </div>
    )
}

export function RedirectLink(){
    return(
        <div>
            <a href="https://www.linkedin.com/in/erley-diangelys-760886144/" target="_blank">
                <FaLinkedinIn size={20} color="#fff" />
            </a>
        </div>
    )
}

function enviarMensagem(user) {
  const  num = '88996052231';
  const  mgs = `falo em nome de: ${user.nome} `

    var url = `https://api.whatsapp.com/send?phone=55${num}&text=${mgs}`;
    window.open(url, '_blank');
    console.log(url);
}