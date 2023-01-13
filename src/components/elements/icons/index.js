const xmlns = "http://www.w3.org/2000/svg"
const version = "1.1"

export const CrossIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    className = "",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 212.982 212.982"
        xmlSpace="preserve"
        width={width}
        height={height}
        fill={color}
        className={className}
        onClick={onClick}
    >
        <path d="M131.804,106.491l75.936-75.936c6.99-6.99,6.99-18.323,0-25.312
		c-6.99-6.99-18.322-6.99-25.312,0l-75.937,75.937L30.554,5.242c-6.99-6.99-18.322-6.99-25.312,0c-6.989,6.99-6.989,18.323,0,25.312
		l75.937,75.936L5.242,182.427c-6.989,6.99-6.989,18.323,0,25.312c6.99,6.99,18.322,6.99,25.312,0l75.937-75.937l75.937,75.937
		c6.989,6.99,18.322,6.99,25.312,0c6.99-6.99,6.99-18.322,0-25.312L131.804,106.491z"/>
    </svg>
)

export const PlusIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    className = "",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 286.376 286.376"
        xmlSpace="preserve"
        width={width}
        height={height}
        fill={color}
        className={className}
        onClick={onClick}
    >
        <path d="M268.477,125.29H161.086V17.899c0-9.885-8.013-17.898-17.898-17.898
                s-17.898,8.013-17.898,17.898v107.39H17.9c-9.885,0-17.9,8.013-17.9,17.898c0,9.885,8.015,17.898,17.9,17.898h107.39v107.39
                c0,9.885,8.013,17.898,17.898,17.898s17.898-8.013,17.898-17.898v-107.39h107.391c9.885,0,17.898-8.014,17.898-17.898
                C286.376,133.303,278.362,125.29,268.477,125.29z"/>
    </svg>
)

export const MoreOptionsIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 408 408"
        xmlSpace="preserve"
        width={width}
        height={height}
        fill={color}
        onClick={onClick}
    >
        <path d="M204,102c28.05,0,51-22.95,51-51S232.05,0,204,0s-51,22.95-51,51S175.95,102,204,102z M204,153c-28.05,0-51,22.95-51,51
			s22.95,51,51,51s51-22.95,51-51S232.05,153,204,153z M204,306c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51
			S232.05,306,204,306z"/>
    </svg>
)

export const LogoutIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    className = "",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 612 612"
        xmlSpace="preserve"
        width={width} height={height}
        fill={color}
        className={className}
        onClick={onClick}
    >
        <polygon points="222.545,319.909 577.228,319.909 500.728,445.091 528.546,445.091 612,306 528.546,166.909 500.728,166.909 
			577.228,292.146 222.545,292.146"/>
        <polygon points="0,612 417.272,612 417.272,431.182 389.454,431.182 389.454,584.182 27.818,584.182 27.818,27.818 
			389.454,27.818 389.454,180.818 417.272,180.818 417.272,0 0,0"/>
    </svg>
)

export const ArrowIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    className = "",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 59.414 59.414"
        xmlSpace="preserve"
        width={width}
        height={height}
        fill={color}
        className={className}
        onClick={onClick}
    >
        <polygon points="29.707,45.268 0,15.561 1.414,14.146 29.707,42.439 58,14.146 59.414,15.561" />
    </svg>
)

export const DoubleArrowIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    className = "",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 485.213 485.212"
        xmlSpace="preserve"
        width={width}
        height={height}
        fill={color}
        className={className}
        onClick={onClick}
    >
        <path d="M0.001,242.606L121.305,0h121.302L121.305,242.606l121.302,242.606H121.305L0.001,242.606z M363.909,485.212h121.303
		L363.909,242.606L485.212,0H363.909L242.607,242.606L363.909,485.212z"/>
    </svg>
)

export const HamburgerIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    className = "",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 48 48"
        width={width}
        height={height}
        fill={color}
        className={className}
        onClick={onClick}
    >
        <path d="M7.94977 11.9498H39.9498" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.94977 23.9498H39.9498" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.94977 35.9498H39.9498" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export const FileIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    className = "",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 30 30"
        width={width}
        height={height}
        fill={color}
        className={className}
        onClick={onClick}
    >
        <path d="M8.5 19h13c.277 0 .5.223.5.5s-.223.5-.5.5h-13c-.277 0-.5-.223-.5-.5s.223-.5.5-.5zm0-4h13c.277 0 
        .5.223.5.5s-.223.5-.5.5h-13c-.277 0-.5-.223-.5-.5s.223-.5.5-.5zm0-4h13c.277 0 .5.223.5.5s-.223.5-.5.5h-13c-.277 
        0-.5-.223-.5-.5s.223-.5.5-.5zm10-9c-.276.004-.504.224-.5.5v4c0 .822.678 1.5 1.5 1.5h4c.665 0 .66-1 0-1h-4c-.286 
        0-.5-.214-.5-.5v-4c.004-.282-.218-.504-.5-.5zm-14-2C3.678 0 3 .678 3 1.5v27c0 .822.678 1.5 1.5 1.5h21c.822 0 
        1.5-.678 1.5-1.5v-21c0-.133-.053-.26-.146-.354l-7-7C19.76.053 19.634 0 19.5 0zm0 1h14.793L26 7.707V28.5c0 
        .286-.214.5-.5.5h-21c-.286 0-.5-.214-.5-.5v-27c0-.286.214-.5.5-.5z"/>
    </svg>
)

export const FolderIcon = ({
    width = 20,
    height = 20,
    color = "#000",
    className = "",
    onClick = () => { }
}) => (
    <svg
        xmlns={xmlns}
        version={version}
        viewBox="0 0 32 32"
        width={width}
        height={height}
        fill={color}
        className={className}
        onClick={onClick}
    >
        <path d="M28,28H4a3,3,0,0,1-3-3V7A3,3,0,0,1,4,4h8a1,1,0,0,1,.77.36L15.8,8H28a3,3,0,0,1,3,3V25A3,3,0,0,1,28,
        28ZM4,6A1,1,0,0,0,3,7V25a1,1,0,0,0,1,1H28a1,1,0,0,0,1-1V11a1,1,0,0,0-1-1H15.33a1,1,0,0,1-.76-.36L11.53,6Z"/>
    </svg>
)