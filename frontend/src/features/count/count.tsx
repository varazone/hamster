import { Button } from '@gear-js/vara-ui';
import { useHamsterState, useStateMessage } from '@/app/hooks/use-read-state';

import NinjaImage from './assets/ninja.png';
import CoinImage from './assets/coin.png';

import styles from './style.module.scss';

export const Count = () => {
  const handleMessage = useStateMessage();
  const { state } = useHamsterState();

  const onClick = () => {
    handleMessage({
      payload: 'Click',
      gasLimit: 120000000000,
    });
  };

  return (
    <div className={styles.count}>
      <div className={styles.coin}>
        <img src={CoinImage} alt="" />
        <span>{state}</span>
      </div>
      <br />
      <div className={styles.ninja} onClick={onClick}>
        <img src={NinjaImage} alt="" />
        <Button text="Ping" />
      </div>
    </div>
  );
};
