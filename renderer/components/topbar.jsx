export default function TopBar(selectedNote) {
    let bibby = selectedNote.selectedNote
    console.log(bibby)
    const clicked = () => {
        console.log("blooo bloo blibby", bibby)
        console.log(bibby=="none")
    }
    return(
        <div className="top-bar">
            
            {
                bibby!="none" ? 
            <div className="" style={{color: "white"}}>
                {/* {bibby.map((bib, index) => (
                    <div>{{bib}}</div>
                ))} */}
                {bibby}
            </div>
            :
            <div style={{color: "white"}}>nothing</div>
            }
            
            <button onClick={clicked}>Click me</button>
        </div>
    )
}