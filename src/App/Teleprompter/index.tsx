import React, {ChangeEvent, useState} from 'react'

import {AppBar, Button, FormControlLabel, Grid, Slider, Switch, TextField, useTheme} from '@material-ui/core'
import {Description, FastForward, Fullscreen, GitHub, SwapHoriz, TextFields} from '@material-ui/icons'
import useWindowScrollPosition from '@rehooks/window-scroll-position'
import Scroll from 'react-scroll'
import screenfull from 'screenfull'

import styles from './App.module.css'
import TeleprompterText from './TeleprompterText'


export default function() {
  const [text, setText] = useState('')
  const [fontSize, setFontSize] = useState(.5)
  const [scrollSpeed, setScrollSpeed] = useState(.5)
  const [flipX, setFlipX] = useState(false)
  const [numVisibleLines, setNumVisibleLines] = useState(0)

  const theme = useTheme()
  const scrollPosition = useWindowScrollPosition()

  const onTextInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setText(event.currentTarget.value)
  const onFontSizeInputChange = (event: ChangeEvent<{}>, value: number | number[]) => setFontSize(Array.isArray(value) ? value[0] : value)
  const onScrollSpeedInputChange = (event: ChangeEvent<{}>, value: number | number[]) => setScrollSpeed(Array.isArray(value) ? value[0] : value)
  const onFlipXSwitchChange = (event: ChangeEvent<HTMLInputElement>) => setFlipX(event.currentTarget.checked)
  const onFullScreenButtonClick = async () => {
    if (screenfull.isEnabled) {
      await screenfull.request()
    }
  }

  const scrollToBottom = () => {
    const lineScrollDurationMs = 8000 * (1 - scrollSpeed) + 192

    Scroll.animateScroll.scrollToBottom({
      duration: lineScrollDurationMs * numVisibleLines,
      isDynamic: true,
      offset: scrollPosition,
      smooth: 'linear'
    })
  }

  return <div className={styles.app}>
    <header>
      <AppBar position='fixed' style={{background: theme.palette.background.default}}>
        <Grid container spacing={4} justify='center' alignItems='center'>
          <Grid item>
            <FormControlLabel
              control={<TextField placeholder='Escrever o roteiro.' value={text} onChange={onTextInputChange}/>}
              label={<Description/>}/>
          </Grid>
          <Grid item>
            <FormControlLabel className={styles.sliderControl}
                              control={<Slider min={0} max={1} step={0.01} value={scrollSpeed}
                                               onChange={onScrollSpeedInputChange} style={{width: '8em'}}/>}
                              label={<FastForward/>}/>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={<Slider min={0} max={1} step={0.01} value={fontSize} onChange={onFontSizeInputChange}
                               style={{width: '8em'}}/>}
              label={<TextFields style={{transform: 'scaleX(-1)'}}/>}/>
          </Grid>
          <Grid item>
            <FormControlLabel control={<Switch onChange={onFlipXSwitchChange}/>}
                              label={<SwapHoriz/>}/>
          </Grid>
          <Grid item>
            <Button onClick={scrollToBottom} variant='outlined'>Iniciar</Button>
          </Grid>
          <Grid item>
            <Button onClick={onFullScreenButtonClick} variant='outlined'><Fullscreen/></Button>
          </Grid>
          <Grid item>
          </Grid>
        </Grid>
      </AppBar>
    </header>
    <TeleprompterText
      text={text}
      fontSize={`${(10 * fontSize) + 2}em`}
      flipX={flipX}
      onNumVisibleLinesChange={setNumVisibleLines}/>
  </div>
}
