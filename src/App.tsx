import React, { useState, useReducer, useEffect } from 'react';

import './App.css';
import _ from 'lodash/fp';
import classNames from 'classnames';
import { DateTime, Interval } from 'luxon';
import { v4 } from 'uuid';
import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import {
  Classes,
  Alignment,
  Intent,
  Spinner,
  Button,
  AnchorButton,
  Icon,
  Card,
  Toast,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Callout,
  IconName,
  TextArea,
  InputGroup,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Position,
  Tab,
  Tabs,
  Drawer,
  Divider,
} from '@blueprintjs/core';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import { FocusStyleManager } from '@blueprintjs/core';
import { TimezonePicker } from '@blueprintjs/timezone';
FocusStyleManager.onlyShowFocusOnTabs();

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-gray-100">
      <Navbar className={Classes.DARK}>
        <NavbarGroup>
          <NavbarHeading>
            <label className="font-semibold">Leonardi's shop </label>
            <Icon icon="shop" iconSize={16} intent="none" />
          </NavbarHeading>
          <TimezonePicker
            className="mr-2"
            popoverProps={{ position: Position.BOTTOM }}
            showLocalTimezone={false}
            placeholder="scegli la zona..."
          ></TimezonePicker>
          <InputGroup
            asyncControl={true}
            large={true}
            leftIcon="search"
            placeholder="Cerca un prodotto..."
          />
        </NavbarGroup>
        <NavbarGroup align="right">
          <Menu large={false} className="p-0 min-w-0 ">
            <MenuItem text="Account" icon="people" className={Classes.MINIMAL}>
              <MenuItem text="Il mio account">
                <MenuItem text="I miei ordini"></MenuItem>
              </MenuItem>
              <Menu.Divider />
              <MenuItem text="Lista">
                <MenuItem text="Pc" />
                <MenuItem text="SmartHome" />
              </MenuItem>
            </MenuItem>
          </Menu>
          <Button className={Classes.MINIMAL} icon="compressed" text="Resi" />
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon="shopping-cart"
            text="Carrello"
            onClick={() => setIsOpen(true)}
          ></Button>
          <Drawer
            icon="shopping-cart"
            isOpen={isOpen}
            title="Carrello"
            isCloseButtonShown={true}
            onClose={() => setIsOpen(false)}
            onClosing={() => setIsOpen(false)}
            onClosed={() => setIsOpen(false)}
            canOutsideClickClose={true}
          >
            <div className={Classes.DRAWER_BODY}>
              <div className={Classes.DIALOG_BODY}>
                <p>
                  <strong>Elementi nel carrello:</strong>
                </p>
                <Card interactive={true} className="m-4 flex ">
                  <img
                    src="https://images-eu.ssl-images-amazon.com/images/G/29/kindle/journeys/NjkzM2MxYWEt/NjkzM2MxYWEt-MzFhNzkxYTMt-w186._SY116_CB660760342_.jpg"
                    alt=""
                    className="object-cover "
                  />
                  <div className="mx-2">
                    <h1 className="text-2xl font-semibold  text-blue-600">
                      Amazon echo di 3 gen...
                    </h1>
                    <p className="text-green-700">disponibilità immediata</p>
                    <div className="flex mt-3 cursor-pointer ">
                      <p className="hover:text-blue-700" /* onClick={} */>
                        Rimuovi
                      </p>
                      <Divider />
                      <p className="hover:text-blue-700">
                        Sposta in elementi salvati
                      </p>
                      <Divider />
                      <p className="hover:text-blue-700">
                        Sposta lista dei desideri
                      </p>
                      <Divider />
                      <p className="hover:text-blue-700">
                        Mostra articoli simili
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div className={Classes.DRAWER_FOOTER}>
              <div className="flex items-center justify-around ">
                <p className="font-semibold text-lg">Prezzo totale: 999€</p>
                <Button className="m-2 " intent="warning">
                  Acquista ora
                </Button>
              </div>
            </div>
          </Drawer>
        </NavbarGroup>
      </Navbar>
      <Tabs
        id="TabsExample"
        selectedTabId="all"
        className=" pl-4 pr-4 bg-gray-100"
        large={true}
      >
        <Tab id="all" title="Tutte" large={true} />
        <Tab id="bs" title="Bestseller" large={true} />
        <Tab id="bc" title="Basic" large={true} />
        <Tabs.Expander />
      </Tabs>
      <div className="flex justify-center flex-wrap">
        <Card interactive={true} className="m-4 w-1/5">
          <h1 className="text-2xl font-semibold m-2">Dispositivi Amazon</h1>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/29/kindle/journeys/NjkzM2MxYWEt/NjkzM2MxYWEt-MzFhNzkxYTMt-w186._SY116_CB660760342_.jpg"
            alt=""
            className="object-cover w-full"
          />
          <Button className="m-2 ">scopri di più</Button>
        </Card>

        <Card interactive={true} className="m-4 w-1/5">
          <h1 className="text-2xl font-semibold m-2">Amazon Super</h1>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/29/ITES_Amazon_Super/XCM_Manual_ORIGIN_1229035_1206048_IT_it_it_amazon_super_traffic_drivers_it_it_3145424_379x304_1X_it_IT._SY304_CB410658417_.jpg"
            alt=""
            className="object-cover w-full"
          />
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-1/5">
          <h1 className="text-2xl font-semibold m-2">Offerte in Moda</h1>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/29/AmazonServices/Site/US/Product/FBA/Outlet/Merchandising/IT_Outlet_GW_MC_186x116_Evergreen_2021._SY116_CB656897980_.jpg"
            alt=""
            className="object-cover w-full"
          />
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-1/5">
          <h1 className="text-2xl font-semibold m-2">
            Salute e cura dei marchi Amazon
          </h1>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/29/PBConsumables/GW/2021/XCM_Manual_1309063_1577659_uk_gw_pc_quad_image_card_1x_186x116_gb-en_ce3adbc5-30ff-409d-97ad-cd59ead11cc7._SY116_CB660372510_.jpg"
            alt=""
            className="object-cover w-full"
          />
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-1/5">
          <h1 className="text-2xl font-semibold m-2">
            Accessori per elettronica
          </h1>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/29/UK-hq/2021/img/Amazon_Basics/XCM_CUTTLE_1308697_1575862_IT_3675381_186x116_1X_en_GB._SY116_CB659579760_.jpg"
            alt=""
            className="object-cover w-full"
          />
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-1/5">
          <h1 className="text-2xl font-semibold m-2">
            Prodotti per la casa Made in Italy
          </h1>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/29/ACS/Made_in_Italy/2021/GW_Quad/mmonicel_GW_DQuad_textile_186x116._SY116_CB655386862_.jpg"
            alt=""
            className="object-cover w-full"
          />
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-1/5">
          <h1 className="text-2xl font-semibold m-2">
            Offerte sugli accessori
          </h1>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/29/kindle/journeys/NmQ4ZGU2YjIt/NmQ4ZGU2YjIt-NjljNDMxODkt-w379._SY304_CB411538173_.jpg"
            alt=""
            className="object-cover w-full"
          />
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-1/5">
          <h1 className="text-2xl font-semibold m-2">Gioielli da donna</h1>
          <img
            src="https://images-eu.ssl-images-amazon.com/images/G/29/AMAZON-FASHION/2021/FASHION/FLIP/01_FEB/MERCH/GW/GIFTING/GW_DESK_QUAD_CARD_186x116_WMN_NECKLESS._SY116_CB658894135_.jpg"
            alt=""
            className="object-cover w-full"
          />
          <Button className="m-2">scopri di più</Button>
        </Card>
      </div>

      <div className="flex justify-center flex-wrap mt-5">
        <Card interactive={true} className="m-4 w-2/5 flex-grow">
          <h1 className="text-2xl font-semibold m-2">
            Consigliati in base ai tuoi interessi
          </h1>
          <div className="flex">
            <img
              src="https://m.media-amazon.com/images/I/41PWkoT0grL._AC_SY200_.jpg"
              alt=""
              className="m-2"
            />
            <img
              src="https://m.media-amazon.com/images/I/31MrZOmn1JL._AC_SY200_.jpg"
              alt=""
              className="m-2"
            />
            <img
              src="https://m.media-amazon.com/images/I/41bfbuO-CqL._AC_SY200_.jpg"
              alt=""
              className="m-2"
            />
            <img
              src="https://m.media-amazon.com/images/I/41BBJ4ZsKsL._AC_SY200_.jpg"
              alt=""
              className="m-2"
            />
            <img
              src="https://m.media-amazon.com/images/I/41UG0BhADZL._AC_SY200_.jpg"
              alt=""
              className="m-2"
            />
            <img
              src="https://m.media-amazon.com/images/I/41pOZehsVSL._AC_SY200_.jpg"
              alt=""
              className="m-2"
            />
            <img
              src="https://m.media-amazon.com/images/I/31QI0tjebIL._AC_SY200_.jpg"
              alt=""
              className="m-2"
            />
            <img
              src="https://m.media-amazon.com/images/I/41KTONmtJ5L._AC_SY200_.jpg"
              alt=""
              className="m-2"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-center flex-wrap mt-5">
        <Card interactive={true} className="m-4 w-2/5">
          <h1 className="text-2xl font-semibold m-2">Tracciamento</h1>
          <p className="m-2">Traccia i tuoi ordini</p>
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-2/5">
          <h1 className="text-2xl font-semibold m-2">Impostazioni</h1>
          <p className="m-2">Vai nelle impostazioni</p>
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-2/5">
          <h1 className="text-2xl font-semibold m-2">Pagamenti</h1>
          <p className="m-2">Scegli i pagamenti con carta</p>
          <Button className="m-2">scopri di più</Button>
        </Card>
        <Card interactive={true} className="m-4 w-2/5">
          <h1 className="text-2xl font-semibold m-2">Indirizzi</h1>
          <p className="m-2">Scegli l'indirizzo di spedizione</p>
          <Button className="m-2">scopri di più</Button>
        </Card>
      </div>
    </div>
  );
}

export default App;
