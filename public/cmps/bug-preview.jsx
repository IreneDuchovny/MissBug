

export function BugPreview({bug}) {
function getImg() {
    switch (bug.severity) {
        case 1:
            return '../assets/img/0.png'
        case 2:
            return '../assets/img/1.png'
        case 3:
            return '../assets/img/2.png'
        case 4:
            return '../assets/img/3.png'
        case 5:
            return '../assets/img/4.png'
        case 6:
            return '../assets/img/5.png'
        case 7:
            return '../assets/img/6.png'
        case 8:
            return '../assets/img/7.png'
        case 9:
            return '../assets/img/8.png'
        case 10:
            return '../assets/img/9.png'
        default:
            return '../assets/img/0.png'
    }
}


    return <artice>
        <h4>{bug.title}</h4>
       <img className="bug-images" src= {getImg()} />
        <p>Severity: <span>{bug.severity}</span></p>
    </artice>
}