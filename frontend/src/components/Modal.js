export default function Modal(form, hidden, hideModal) {

    return (
        <div className={hidden ? "modal hidden" : "modal"}>
            <link type="text/css" rel="stylesheet" href="stylesheets/modal.css" />
            <div className="hider" />
            <div className={"modal-content"}>
                <img onClick={() => hideModal(true)} className="inverted-img close-button" src="https://cdnjs.cloudflare.com/ajax/libs/octicons/8.5.0/svg/x.svg" alt="close button"/>
                { form }
            </div>
        </div>
    )
}