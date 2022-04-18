    import './tooltip.css';
    
    export default function Tooltip({name, text}){
        return(
        <div class="tooltip">{name}

            <span class="tooltiptext">{text}</span>
        </div>
        )
    }
    
    