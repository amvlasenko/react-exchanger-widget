function Currency(props) {
    const { ticker, name, image, setCurrent } = props;
    const currencyStyle = {
        backgroundImage: 'url(' + image + ')',
    };

    const handler = () => {
        setCurrent(name, image);
    };

    return (
        <div className='exchange-currency'>
            <button style={currencyStyle} onClick={handler} aria-label={name}>
                <span className={'cryptoTicker'}>{ticker} </span>
                <span className={'cryptoName'}>{name}</span>
            </button>
        </div>
    );
}
export { Currency };
