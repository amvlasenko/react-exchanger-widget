import { Currency } from './Currency';

function Currencies(props) {
    return (
        <div className='currencies'>
            {props.currencies
                .filter(
                    (currency) =>
                        currency.name.includes(props.searchString) ||
                        currency.ticker.includes(props.searchString)
                )
                .map((currency) => (
                    <Currency
                        key={currency.name}
                        {...currency}
                        setCurrent={props.setCurrent}
                        getMinAmount={props.getMinAmount}
                        getEstimatedAmount={props.getEstimatedAmount}
                        name={currency.name}
                    />
                ))}
        </div>
    );
}

export { Currencies };
