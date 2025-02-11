import './index.css'

import React, { useContext, useEffect, useState } from 'react'

import { AppSettings, Runner, WineInstallation } from 'src/types'
import { Clipboard, IpcRenderer } from 'electron'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { getGameInfo, writeConfig } from 'src/helpers'
import { useToggle } from 'src/hooks'
import { useTranslation } from 'react-i18next'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'

import ContextProvider from 'src/state/ContextProvider'
import UpdateComponent from 'src/components/UI/UpdateComponent'

import GeneralSettings from './components/GeneralSettings'
import OtherSettings from './components/OtherSettings'
import SyncSaves from './components/SyncSaves'
import Tools from './components/Tools'
import WineSettings from './components/WineSettings'
import LogSettings from './components/LogSettings'
import { AdvancedSettings } from './components/AdvancedSettings'
import FooterInfo from './components/FooterInfo'
import { configStore } from 'src/helpers/electronStores'
import ContextMenu from '../Library/components/ContextMenu'

interface ElectronProps {
  ipcRenderer: IpcRenderer
  clipboard: Clipboard
}

const { ipcRenderer, clipboard } = window.require('electron') as ElectronProps

interface LocationState {
  fromGameCard: boolean
  runner: Runner
  isLinuxNative: boolean
  isMacNative: boolean
}

function Settings() {
  const { t, i18n } = useTranslation()
  const {
    state: { fromGameCard, runner, isLinuxNative, isMacNative }
  } = useLocation() as { state: LocationState }
  const { platform } = useContext(ContextProvider)
  const isWin = platform === 'win32'
  const home = configStore.get('userHome')

  const [wineVersion, setWineVersion] = useState({
    bin: '/usr/bin/wine',
    name: 'Wine Default'
  } as WineInstallation)
  const [winePrefix, setWinePrefix] = useState(`${home}/.wine`)
  const [wineCrossoverBottle, setWineCrossoverBottle] = useState('Heroic')
  const [defaultInstallPath, setDefaultInstallPath] = useState('')
  const [defaultWinePrefix, setDefaultWinePrefix] = useState('')
  const [targetExe, setTargetExe] = useState('')
  const [otherOptions, setOtherOptions] = useState('')
  const [launcherArgs, setLauncherArgs] = useState('')
  const [egsLinkedPath, setEgsLinkedPath] = useState('')
  const [title, setTitle] = useState('')
  const [maxWorkers, setMaxWorkers] = useState(0)
  const [maxRecentGames, setMaxRecentGames] = useState(5)
  const [maxSharpness, setFsrSharpness] = useState(5)
  const [egsPath, setEgsPath] = useState(egsLinkedPath)
  const [altLegendaryBin, setAltLegendaryBin] = useState('')
  const [altGogdlBin, setAltGogdlBin] = useState('')
  const [canRunOffline, setCanRunOffline] = useState(true)
  const [customWinePaths, setCustomWinePaths] = useState([] as Array<string>)
  const [savesPath, setSavesPath] = useState('')

  const {
    on: addDesktopShortcuts,
    toggle: toggleAddDesktopShortcuts,
    setOn: setAddDesktopShortcuts
  } = useToggle(false)
  const {
    on: addStartMenuShortcuts,
    toggle: toggleAddGamesToStartMenu,
    setOn: setAddGamesToStartMenu
  } = useToggle(false)
  const {
    on: useGameMode,
    toggle: toggleUseGameMode,
    setOn: setUseGameMode
  } = useToggle(false)
  const {
    on: useSteamRuntime,
    toggle: toggleUseSteamRuntime,
    setOn: setUseSteamRuntime
  } = useToggle(false)
  const {
    on: nvidiaPrime,
    toggle: toggleNvidiaPrime,
    setOn: setUseNvidiaPrime
  } = useToggle(false)
  const { on: showFps, toggle: toggleFps, setOn: setShowFps } = useToggle(false)
  const {
    on: offlineMode,
    toggle: toggleOffline,
    setOn: setShowOffline
  } = useToggle(false)
  const {
    on: audioFix,
    toggle: toggleAudioFix,
    setOn: setAudioFix
  } = useToggle(false)
  const {
    on: showMangohud,
    toggle: toggleMangoHud,
    setOn: setShowMangoHud
  } = useToggle(false)
  const {
    on: exitToTray,
    toggle: toggleTray,
    setOn: setExitToTray
  } = useToggle(false)
  const {
    on: startInTray,
    toggle: toggleStartInTray,
    setOn: setStartInTray
  } = useToggle(false)
  const {
    on: minimizeOnLaunch,
    toggle: toggleMinimizeOnLaunch,
    setOn: setMinimizeOnLaunch
  } = useToggle(false)
  const {
    on: darkTrayIcon,
    toggle: toggleDarkTrayIcon,
    setOn: setDarkTrayIcon
  } = useToggle(false)
  const {
    on: discordRPC,
    toggle: toggleDiscordRPC,
    setOn: setDiscordRPC
  } = useToggle(false)
  const {
    on: autoInstallDxvk,
    toggle: toggleAutoInstallDxvk,
    setOn: setAutoInstallDxvk
  } = useToggle(false)
  const {
    on: autoInstallVkd3d,
    toggle: toggleAutoInstallVkd3d,
    setOn: setAutoInstallVkd3d
  } = useToggle(false)
  const {
    on: enableFSR,
    toggle: toggleFSR,
    setOn: setEnableFSR
  } = useToggle(false)
  const {
    on: enableResizableBar,
    toggle: toggleResizableBar,
    setOn: setResizableBar
  } = useToggle(false)
  const {
    on: enableEsync,
    toggle: toggleEsync,
    setOn: setEnableEsync
  } = useToggle(false)
  const {
    on: enableFsync,
    toggle: toggleFsync,
    setOn: setEnableFsync
  } = useToggle(false)
  const {
    on: showUnrealMarket,
    toggle: toggleUnrealMarket,
    setOn: setShowUnrealMarket
  } = useToggle(false)
  const {
    on: disableController,
    toggle: toggleDisableController,
    setOn: setDisableController
  } = useToggle(false)

  const [autoSyncSaves, setAutoSyncSaves] = useState(false)
  const [altWine, setAltWine] = useState([] as WineInstallation[])

  const { appName = '', type = '' } = useParams()
  const isDefault = appName === 'default'
  const isGeneralSettings = type === 'general'
  const isWineSettings = type === 'wine'
  const isSyncSettings = type === 'sync'
  const isOtherSettings = type === 'other'
  const isLogSettings = type === 'log'
  const isAdvancedSetting = type === 'advanced' && isDefault

  useEffect(() => {
    const getSettings = async () => {
      const config: AppSettings = await ipcRenderer.invoke(
        'requestSettings',
        appName
      )
      setAutoSyncSaves(config.autoSyncSaves)
      setUseGameMode(config.useGameMode)
      setShowFps(config.showFps)
      setShowOffline(config.offlineMode)
      setAudioFix(config.audioFix)
      setShowMangoHud(config.showMangohud)
      setDefaultInstallPath(config.defaultInstallPath)
      setWineVersion(config.wineVersion)
      setWinePrefix(config.winePrefix)
      setWineCrossoverBottle(config.wineCrossoverBottle)
      setOtherOptions(config.otherOptions)
      setLauncherArgs(config.launcherArgs)
      setUseNvidiaPrime(config.nvidiaPrime)
      setEgsLinkedPath(config.egsLinkedPath || '')
      setEgsPath(config.egsLinkedPath || '')
      setExitToTray(config.exitToTray)
      setStartInTray(config.startInTray)
      setMinimizeOnLaunch(config.minimizeOnLaunch)
      setDarkTrayIcon(config.darkTrayIcon)
      setDiscordRPC(config.discordRPC)
      setAutoInstallDxvk(config.autoInstallDxvk)
      setAutoInstallVkd3d(config.autoInstallVkd3d)
      setEnableEsync(config.enableEsync)
      setEnableFsync(config.enableFsync)
      setEnableFSR(config.enableFSR)
      setFsrSharpness(config.maxSharpness || 2)
      setResizableBar(config.enableResizableBar)
      setSavesPath(config.savesPath || '')
      setMaxWorkers(config.maxWorkers ?? 0)
      setMaxRecentGames(config.maxRecentGames ?? 5)
      setCustomWinePaths(config.customWinePaths || [])
      setAddDesktopShortcuts(config.addDesktopShortcuts)
      setAddGamesToStartMenu(config.addStartMenuShortcuts)
      setCustomWinePaths(config.customWinePaths || [])
      setTargetExe(config.targetExe || '')
      setAltLegendaryBin(config.altLegendaryBin || '')
      setAltGogdlBin(config.altGogdlBin || '')
      setShowUnrealMarket(config.showUnrealMarket)
      setDefaultWinePrefix(config.defaultWinePrefix)
      setUseSteamRuntime(config.useSteamRuntime)
      setDisableController(config.disableController || false)

      if (!isDefault) {
        const { title: gameTitle, canRunOffline: can_run_offline } =
          await getGameInfo(appName, runner)
        setCanRunOffline(can_run_offline)
        setTitle(gameTitle)
      } else {
        setTitle(t('globalSettings', 'Global Settings'))
      }
    }
    getSettings()

    return () => {
      ipcRenderer.removeAllListeners('requestSettings')
    }
  }, [appName, type, isDefault, i18n.language])

  const GlobalSettings = {
    altLegendaryBin,
    altGogdlBin,
    addDesktopShortcuts,
    addStartMenuShortcuts,
    audioFix,
    autoInstallDxvk,
    autoInstallVkd3d,
    customWinePaths,
    darkTrayIcon,
    defaultInstallPath,
    defaultWinePrefix,
    disableController,
    discordRPC,
    egsLinkedPath,
    enableEsync,
    enableFsync,
    exitToTray,
    maxRecentGames,
    maxWorkers,
    minimizeOnLaunch,
    nvidiaPrime,
    otherOptions,
    showFps,
    showMangohud,
    showUnrealMarket,
    startInTray,
    useGameMode,
    wineCrossoverBottle,
    winePrefix,
    wineVersion,
    enableFSR,
    enableResizableBar
  } as AppSettings

  const GameSettings = {
    audioFix,
    autoInstallDxvk,
    autoInstallVkd3d,
    autoSyncSaves,
    enableEsync,
    enableFSR,
    enableFsync,
    maxSharpness,
    enableResizableBar,
    launcherArgs,
    nvidiaPrime,
    offlineMode,
    otherOptions,
    savesPath,
    showFps,
    showMangohud,
    targetExe,
    useGameMode,
    wineCrossoverBottle,
    winePrefix,
    wineVersion,
    useSteamRuntime
  } as AppSettings

  const settingsToSave = isDefault ? GlobalSettings : GameSettings
  let returnPath = '/'

  if (!fromGameCard) {
    returnPath = `/gamepage/${appName}`
    if (returnPath === '/gamepage/default') {
      returnPath = '/'
    }
  }

  useEffect(() => {
    writeConfig([appName, settingsToSave])
  }, [GlobalSettings, GameSettings, appName])

  if (!title) {
    return <UpdateComponent />
  }

  return (
    <ContextMenu
      items={[
        {
          label: t(
            'settings.copyToClipboard',
            'Copy All Settings to Clipboard'
          ),
          onclick: () =>
            clipboard.writeText(
              JSON.stringify({ appName, title, ...settingsToSave })
            ),
          show: !isLogSettings
        },
        {
          label: t('settings.open-config-file', 'Open Config File'),
          onclick: () => ipcRenderer.send('showConfigFileInFolder', appName),
          show: !isLogSettings
        }
      ]}
    >
      <div className="Settings">
        <div role="list" className="settingsWrapper">
          <NavLink to={returnPath} role="link" className="backButton">
            <ArrowCircleLeftIcon />
          </NavLink>
          {title && (
            <h1 className="headerTitle" data-testid="headerTitle">
              {title}
            </h1>
          )}
          {isGeneralSettings && (
            <GeneralSettings
              egsPath={egsPath}
              setEgsPath={setEgsPath}
              egsLinkedPath={egsLinkedPath}
              setEgsLinkedPath={setEgsLinkedPath}
              defaultInstallPath={defaultInstallPath}
              setDefaultInstallPath={setDefaultInstallPath}
              exitToTray={exitToTray}
              startInTray={startInTray}
              toggleTray={toggleTray}
              toggleStartInTray={toggleStartInTray}
              maxWorkers={maxWorkers}
              setMaxWorkers={setMaxWorkers}
              toggleDarkTrayIcon={toggleDarkTrayIcon}
              darkTrayIcon={darkTrayIcon}
              toggleUnrealMarket={toggleUnrealMarket}
              showUnrealMarket={showUnrealMarket}
              minimizeOnLaunch={minimizeOnLaunch}
              toggleMinimizeOnLaunch={toggleMinimizeOnLaunch}
              disableController={disableController}
              toggleDisableController={toggleDisableController}
            />
          )}
          {isWineSettings && (
            <WineSettings
              altWine={altWine}
              setAltWine={setAltWine}
              wineVersion={wineVersion}
              winePrefix={winePrefix}
              setWineVersion={setWineVersion}
              setWinePrefix={setWinePrefix}
              wineCrossoverBottle={wineCrossoverBottle}
              setWineCrossoverBottle={setWineCrossoverBottle}
              autoInstallDxvk={autoInstallDxvk}
              autoInstallVkd3d={autoInstallVkd3d}
              toggleAutoInstallDxvk={toggleAutoInstallDxvk}
              toggleAutoInstallVkd3d={toggleAutoInstallVkd3d}
              customWinePaths={customWinePaths}
              setCustomWinePaths={setCustomWinePaths}
              isDefault={isDefault}
              enableFSR={enableFSR}
              toggleFSR={toggleFSR}
              enableEsync={enableEsync}
              toggleEsync={toggleEsync}
              enableFsync={enableFsync}
              toggleFsync={toggleFsync}
              defaultWinePrefix={defaultWinePrefix}
              setDefaultWinePrefix={setDefaultWinePrefix}
              maxSharpness={maxSharpness}
              setFsrSharpness={setFsrSharpness}
              enableResizableBar={enableResizableBar}
              toggleResizableBar={toggleResizableBar}
            />
          )}
          {isWineSettings && !isDefault && <Tools appName={appName} />}
          {isOtherSettings && (
            <OtherSettings
              otherOptions={otherOptions}
              setOtherOptions={setOtherOptions}
              launcherArgs={launcherArgs}
              setLauncherArgs={setLauncherArgs}
              useGameMode={useGameMode}
              toggleUseGameMode={toggleUseGameMode}
              primeRun={nvidiaPrime}
              togglePrimeRun={toggleNvidiaPrime}
              showFps={showFps}
              toggleFps={toggleFps}
              canRunOffline={canRunOffline}
              offlineMode={offlineMode}
              toggleOffline={toggleOffline}
              audioFix={audioFix}
              toggleAudioFix={toggleAudioFix}
              showMangohud={showMangohud}
              toggleMangoHud={toggleMangoHud}
              isDefault={isDefault}
              maxRecentGames={maxRecentGames}
              setMaxRecentGames={setMaxRecentGames}
              addDesktopShortcuts={addDesktopShortcuts}
              addGamesToStartMenu={addStartMenuShortcuts}
              toggleAddDesktopShortcuts={toggleAddDesktopShortcuts}
              toggleAddGamesToStartMenu={toggleAddGamesToStartMenu}
              toggleDiscordRPC={toggleDiscordRPC}
              discordRPC={discordRPC}
              targetExe={targetExe}
              setTargetExe={setTargetExe}
              useSteamRuntime={useSteamRuntime}
              toggleUseSteamRuntime={toggleUseSteamRuntime}
              isMacNative={isMacNative}
              isLinuxNative={isLinuxNative}
              isProton={wineVersion.type === 'proton'}
              appName={appName}
            />
          )}
          {isSyncSettings && (
            <SyncSaves
              savesPath={savesPath}
              setSavesPath={setSavesPath}
              appName={appName}
              autoSyncSaves={autoSyncSaves}
              setAutoSyncSaves={setAutoSyncSaves}
              isProton={!isWin && wineVersion.type === 'proton'}
              winePrefix={winePrefix}
            />
          )}
          {isAdvancedSetting && (
            <AdvancedSettings
              altLegendaryBin={altLegendaryBin}
              setAltLegendaryBin={setAltLegendaryBin}
              altGogdlBin={altGogdlBin}
              setAltGogdlBin={setAltGogdlBin}
              settingsToSave={settingsToSave}
            />
          )}
          {isLogSettings && (
            <LogSettings isDefault={isDefault} appName={appName} />
          )}
          <FooterInfo appName={appName} />
        </div>
      </div>
    </ContextMenu>
  )
}

export default React.memo(Settings)
