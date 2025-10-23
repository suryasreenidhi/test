import React, { useEffect } from 'react';
import { isEmpty } from 'lodash';
import Emitter from 'onevzsoemfeframework/Emitter';
import { isIpad } from 'onevzsoemfeframework/DomService';
// import { onKeyPressEvent } from 'onevzsoemfecommon/Helpers/validation';
import Coin from '@vds/icons/coin';
import { Button } from '@vds/buttons';
import { Notification } from '@vds/notifications';
import { formatCurrency } from 'onevzsoemfecommon/Helpers/validation';
// import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import Alert from '../../../assets/images/conflictAlert.png';
import Checkmark from '../../../assets/images/checkmark_alt.png';
import './index.css';
// import { Padding20 } from "../../../constants/StyledConstantsGlobal";
import {
  useLazyGetRetrieveCartQuery,
  // useLazyValidateCartAndCheckoutQuery,
  useLazyUpdateConflictStatusQuery,
} from '../../../modules/services/APIService/APIServiceHooks';
import { DARK_THEME_COLOR } from '../../Leftrail/constants/constants';
import { openViewTagging } from '../../ShopLanding/Tagging';
import { LPFlexRedesignFlag } from '../../../utils';
// import Icon from "@vz-soe-utils/icon";
// const homeAndInternetWarningMessage = 'Proceed in completing all activity for the mobile plans and then add a 5G Home Internet line BAU through the Add a Line process flow.';
export const getTopPositionConflictsComponent = (scmCheckoutMfeEnabled, isAcssProspectNewCustomerTab) => {
  if (scmCheckoutMfeEnabled) {
    return isAcssProspectNewCustomerTab ? 0 : '3.05rem';
  }
  return '0px';
};
function PlanConflicts(props) {
  const isAPISuccess = (api) =>
    api?.isSuccess &&
    api?.status === 'fulfilled' &&
    !api?.isError &&
    !api?.isFetching &&
    !api?.isLoading &&
    !api?.isUninitialized;

  const scmCheckoutMfeEnabled = window?.mfe?.scmCheckoutMfeEnable || false;
  const wifiBackupConflictEnabledFFlag = window?.mfe?.wifiBackupConflictEnableFFlag || false;
  const isDark = window?.mfe?.scmDeviceMfeEnable && window?.mfe?.isDark;
  const bgColor = window?.mfe?.scmDeviceMfeEnable && window?.mfe?.themeProps?.background;
  const isAcssProspectNewCustomerTab = window?.mfe?.isProspectNewCustomerTab;

  const PlanConflictsModalStyle = styled.div`
    z-index: 1000;
    position: ${!scmCheckoutMfeEnabled ? 'fixed' : 'relative'};
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    overflow-y: scroll;
    background: ${isDark ? bgColor : DARK_THEME_COLOR};
  `;
  const ProspectPlanConflictsModal = styled.div`
    z-index: 1000;
    position: ${!scmCheckoutMfeEnabled ? 'fixed' : 'relative'};
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    background: ${isDark ? bgColor : DARK_THEME_COLOR};
  `;
  const PlanConflictsModal = isAcssProspectNewCustomerTab ? ProspectPlanConflictsModal : PlanConflictsModalStyle;
  const NotificationDiv = styled(Notification)`
    position: fixed;
    z-index: 2;
  `;
  const isPrepayOrder = true;
  // const navigate = useNavigate();

  const { conflictsData = [], showConflicts = true, isPromoBundleFlow, acceptButtonDisabler = false } = props || {};

  const [updateConflictsStatus, updateConflictsStatusResult] = useLazyUpdateConflictStatusQuery();

  const [getReteriveCart /* ReteriveCartResult */] = useLazyGetRetrieveCartQuery();

  console.log('==ConflictsStatusResult==', updateConflictsStatusResult);
  // const [validateCartAndCheckout, validateCartAndCheckoutResult] = useLazyValidateCartAndCheckoutQuery();

  // console.log('validateCartAndCheckoutResult', validateCartAndCheckoutResult)
  useEffect(() => {
    openViewTagging('Conflicts');
  }, []);
  useEffect(() => {
    if (isAPISuccess(updateConflictsStatusResult)) {
      const retrieveCartPayload = {
        meta: {
          client: 'CXP',
        },
        data: {
          cartId: scmCheckoutMfeEnabled ? sessionStorage.getItem('acssMfeCartId') : '',
          retrieveCurrentFeatures: true,
        },
      };
      getReteriveCart({ body: retrieveCartPayload });
    }
  }, [updateConflictsStatusResult]);

  let effectiveDate = '';
  const currentDate = moment(new Date()).format('MM/DD/YYYY');
  if (scmCheckoutMfeEnabled) {
    if (currentDate === props.selectedDate || props.selectedDate === undefined) {
      effectiveDate = 'Today';
    } else {
      effectiveDate = props.selectedDate;
    }
  }
  // const orderEffectiveDateValue = "";
  // if (props?.landing?.accountDetails?.sharedAttributes?.isEffectiveDateEligible) {
  //   let currentDate = moment(new Date()).format("MM/DD/YYYY");
  //   if (promoBundleFlow) {
  //     if (currentDate === props?.landing?.cartDetails?.orderDetails?.effectiveDateDetails?.selectedDate) {
  //       orderEffectiveDateValue = "Today";
  //     } else {
  //       orderEffectiveDateValue = props?.landing?.cartDetails?.orderDetails?.effectiveDateDetails?.selectedDate ? props?.landing?.cartDetails?.orderDetails?.effectiveDateDetails?.selectedDate : "";
  //     }
  //   } else {
  //     if (currentDate === props?.landing?.accountDetails?.sharedAttributes?.selectedEffectiveDate) {
  //       orderEffectiveDateValue = "Today";
  //     } else {
  //       orderEffectiveDateValue = props?.landing?.accountDetails?.sharedAttributes?.selectedEffectiveDate ? props?.landing?.accountDetails?.sharedAttributes?.selectedEffectiveDate : "";
  //     }
  //   }
  // }

  const conflictContentLines = (item) =>
    [...item.conflicts]
      ?.sort((conflictFirst, conflictSecond) =>
        conflictFirst?.actionIndicator < conflictSecond?.actionIndicator ? -1 : 0,
      )
      .map((conflict, index) => (
        <div
          key={conflict.sorId}
          className='Grid Grid--gapless u-paddingLeftSmall u-paddingRightMedium'
          style={{ fontSize: '1.2rem' }}
        >
          <div
            className={`Col Col--md6 Col--lg6 conflicts u-paddingTopLarge u-paddingLeftLarge u-paddingBottomMedium u-paddingAllSmall ${
              index !== 0 ? ' borderTop' : ''
            }`}
          >
            {typeof conflict.quantity === 'number' && conflict.quantity > 1 ? `${conflict.quantity}X -` : ''}
            {conflict.sorId ? `${conflict.sorId} - ` : ' '}
            <span
              dangerouslySetInnerHTML={{
                __html: conflict.featureDesc,
              }}
            />
            {conflict.sorId && parseInt(conflict.sorId, 10) === 1465 ? (
              <span>
                <br />
                <b>UP TO 50% off Connected Device Plan</b>
              </span>
            ) : (
              ''
            )}
            {conflict.sorId &&
            (parseInt(conflict.sorId, 10) === 2153 ||
              parseInt(conflict.sorId, 10) === 2154 ||
              parseInt(conflict.sorId, 10) === 2156) ? (
              <span>
                <br />
                <b>UP TO 50% off 4G LTE/5G Home Internet Plans</b>
              </span>
            ) : (
              ''
            )}
          </div>
          <div
            className={`Col Col--md4 Col--lg4 conflicts u-paddingTopLarge u-paddingAllSmall u-paddingBottomMedium bold" ${
              index !== 0 ? ' borderTop' : ''
            }`}
            style={{ fontWeight: 'bold' }}
          >
            {conflict.actionIndicator === 'D' ? 'DROP' : 'ADD'}
          </div>
          <div
            className={`Col Col--md2 Col--lg2 conflicts u-paddingLeftLarge u-paddingTopLarge u-paddingAllSmall u-paddingBottomMedium bold" ${
              index !== 0 ? ' borderTop' : ''
            }`}
            style={{ fontWeight: 'bold' }}
          >
            {(() => {
              if (conflict.sorId && parseInt(conflict.sorId, 10) === 2634) {
                return 'SEE NBS';
              }
              if (conflict.featureDesc !== 'ACP Discount') {
                return formatCurrency(conflict.price ? conflict.price : '');
              }
              return null;
            })()}
          </div>{' '}
        </div>
      ));

  const conflictTravelPass = (item) => {
    if (item?.travelPassLossNotificationFlag === true) {
      return (
        <div
          className='conflicts u-paddingTopLarge u-paddingLeftLarge u-paddingBottomMedium u-paddingAllSmall borderTop'
          style={{ fontSize: '1.2rem' }}
        >
          <b>With your plan update, you&apos;ll no longer get 1 TravelPass day per month.</b>
        </div>
      );
    }
  };

  const getWidth = () => {
    const conflict = !wifiBackupConflictEnabledFFlag ? '120px' : '30px';
    return conflict;
  };

  const isFFlag = true
  const header = (
    <div
      className='u-floatClearFix'
      style={{ color: isDark ? DARK_THEME_COLOR : '#000000', backgroundColor: isDark ? bgColor : '' }}
    >
      <div className='u-floatLeft'>
        {/* {!props.hideHeaderIcons &&

                    <div className="u-paddingLeftSmall u-paddingYLarge u-displayInlineBlock crsr"
                        onClick={() => { props.closePlanConflicts(); }} aria-label="back" role="button" onKeyPress={(e) => onKeyPressEvent(e) && props.closePlanConflicts()} tabIndex="0">
                        <span className="Icon Icon--left-caret u-alignMiddle u-flexInline u-paddingRightMedium u-marginRightMedium u-borderRightBlack" data-track="Conflicts-back" />
                    </div>
                } */}

        <span
          className='u-paddingLeftLarge u-paddingYLarge u-displayInlineBlock crsr u-marginLeftLarge font-18 bold u-alignMiddle'
          style={{ fontSize: '18px', fontWeight: 'bold' }}
        >
          Conflicts
        </span>
      </div>

      {/* {isPromoBundleFlow && !props.hideHeaderIcons && <div className="float-right inline-flex u-paddingTopLarge u-paddingRightSmall">
                <span data-testid="closeButton" className="u-paddingLeftLarge u-colorPrimary" onClick={() => props.closePlanConflicts()} role="button" tabIndex="0" onKeyDown={(e) => onKeyPressEvent(e) && props.closePlanConflicts()} >
                    <span className="float-right Icon Icon--close font-30" />
                </span>
            </div>} */}
    </div>
  );

  const notificationHeader = (
    <div>
      {props?.conflictsResult?.data?.notifications?.[0]?.title && !isFFlag && (
        <NotificationDiv
          type='warning'
          title={props?.conflictsResult?.data?.notifications[0]?.title}
          subtitle={props?.conflictsResult?.data?.notifications[0]?.subtitle}
          surface='light'
          disableAnimation={false}
          fullBleed
          hideCloseButton={false}
          disableFocus
          inline={false}
          layout={null}
          data-track-ignore=''
        />
      )}
      {isFFlag && props?.conflictsResult?.data?.notifications
        ?.filter(n => n?.type === 'warning' && n?.title)
        ?.map((n, i) => (
          <NotificationDiv
            key={`${n.type}-${n.title}`}
            type='warning'
            title={n.title}
            subtitle={n.subtitle}
            surface='light'
            disableAnimation={false}
            fullBleed
            hideCloseButton={false}
            disableFocus
            inline={false}
            layout={null}
            data-track-ignore=''
          />
        ))}
    </div>
  );

  
  const conflictContent =
    showConflicts &&
    conflictsData &&
    [...conflictsData].map((item) => {
      const { conflicts } = item;
      let acpDiscountContent = '';
      let isAcpDiscounts = false;
      if (!isEmpty(conflicts)) {
        const acpDiscountFilter = conflicts.find(
          (item1) => item1.actionIndicator === 'D' && item1.featureDesc === 'ACP Discount',
        );
        if (acpDiscountFilter && acpDiscountFilter.featureDesc === 'ACP Discount') {
          isAcpDiscounts = true;
          acpDiscountContent = (
            <div
              style={{ fontWeight: 'bold' }}
              className='Col Col--md11 Col--lg11 u-paddingTopLarge u-paddingAllSmall u-paddingBottomMedium bold'
            >
              {isPrepayOrder ? 'ACPDiscountsMessagePrePay' : 'ACPDiscountsMessage'}
            </div>
          );
        }
      }
      return (
        <>
          <div
            className={`${isAcpDiscounts && !isPrepayOrder ? '' : 'Grid'} Grid--gapless u-marginTopMedium ${
              isAcpDiscounts && isPrepayOrder ? '' : 'lines'
            }  fullWidth`}
            key={item.mtn}
          >
            <div className='Col Col--md2 Col--lg2 u-paddingAllLarge'>
              <div
                className='bold u-paddingLeftMedium u-paddingBottomSmall contains-PII'
                style={{ fontWeight: 'bold' }}
              >
                {item?.preferFirstName || item?.firstName}
              </div>
              <div className='bold u-paddingLeftMedium contains-PII' style={{ fontWeight: 'bold' }}>
                {item?.mtn}
              </div>
            </div>
            <div className='Col Col--md10 Col--lg10'>
              {conflictContentLines(item)}
              {conflictTravelPass(item)}
            </div>
            {!isPrepayOrder && isAcpDiscounts && acpDiscountContent}
          </div>
          {isPrepayOrder && isAcpDiscounts && (
            <div className='Grid Grid--gapless u-marginTopMedium lines fullWidth'>
              <div className='Col Col--md1 Col--lg1 u-paddingAllLarge' />
              {acpDiscountContent}
            </div>
          )}
        </>
      );
    });

  const content = (
    <div className='u-marginBottom100'>
      <div
        style={{
          position: isAcssProspectNewCustomerTab ? 'absolute' : 'fixed',
          top: getTopPositionConflictsComponent(scmCheckoutMfeEnabled, isAcssProspectNewCustomerTab),
          zIndex: '2',
          width: '100%',
        }}
      >
        <div
          className={`${isPromoBundleFlow ? 'conflictModalHeaderForPromo' : 'conflictModalHeaderConflictPage'} ${
            isIpad() ? ' mobileHeader' : ''
          }`}
        >
          {!scmCheckoutMfeEnabled && <div style={{ background: 'white' }}>{header}</div>}
          {scmCheckoutMfeEnabled && !isAcssProspectNewCustomerTab && <div>{notificationHeader}</div>}
        </div>
        <div
          className='Grid Grid--gapless fullWidth'
          style={{
            backgroundColor: '#000',
            height: '60px',
            position: 'sticky',
            top: `${scmCheckoutMfeEnabled ? '0' : '52px'}`,
            width: `${scmCheckoutMfeEnabled ? 'calc(100% - 2rem)' : 'auto'}`,
            zIndex: `${scmCheckoutMfeEnabled ? '1' : '2'}`,
          }}
        >
          <div className='Col Col--md2 Col--lg2' />
          <div className='Col Col--md10 Col--lg10'>
            <div className='Grid Grid--gapless u-paddingLeftSmall u-paddingRightMedium' style={{ marginTop: '10px' }}>
              <div className='Col Col--md6 Col--lg6 u-paddingLeftLarge'>
                <img className='headerImg' alt='alert' src={Alert} />
                <span className='conflictsHeaderText' data-testid='conflictHead'>
                  Conflict
                </span>
              </div>
              <div className='Col Col--md4 Col--lg4'>
                <img className='headerImg' alt='checkmark' src={Checkmark} />
                <span className='conflictsHeaderText' data-testid='resolutionHead'>
                  Resolution
                </span>
              </div>
              <div className='Col Col--md2 Col--lg2 u-paddingLeftLarge'>
                <span aria-label='dollar symbol'>
                  <Coin color='#ffffff' size='large' />
                </span>
                <span className='conflictsHeaderText' data-testid='priceHead'>
                  Price
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {conflictContent}
    </div>
  );

  const onAcceptHandler = async () => {
    if (scmCheckoutMfeEnabled) {
      // window?.mfe?.historyRef.push(`handoff.html`);
      props.closePlanConflicts();
    } else {
      const req = {
        conflictsAccepted: true,
      };
      const appPropertiesFromSessionStorage = JSON.parse(sessionStorage.getItem('APP_PROPERTIES'));
      // const lpMFEFlexEnabledFFlagEnabled = /true/i.test(appPropertiesFromSessionStorage?.lpMFERedesignFFlag);
      // const flexRedesignEnabledFFlag = /true/i.test(appPropertiesFromSessionStorage?.flexRedesignFFlag);

      if (
        appPropertiesFromSessionStorage?.isConflictsModalRemoved === 'TRUE' ||
        LPFlexRedesignFlag(appPropertiesFromSessionStorage)
      ) {
        updateConflictsStatus({ body: req, spinner: true });
        Emitter.emit('Conflicts_Accepted', true);
        const sessionCartId = sessionStorage.getItem('cartId')
          ? sessionStorage.getItem('cartId')
          : props?.customerInfo?.cartId;
        const retrieveCartPayload = {
          meta: { client: 'CXP' },
          data: {
            cartId: scmCheckoutMfeEnabled ? sessionStorage.getItem('acssMfeCartId') : sessionCartId,
          },
        };
        getReteriveCart({ body: retrieveCartPayload });
      }
      if (props?.fromLandingFeature === true) {
        Emitter.emit('Close_Conflicts_Page', false);
        props.closePlanConflicts();
      }
    }
  };

  const footer = (
    <div
      className='u-borderTopGray u-paddingAllLarge u-textCenter'
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        color: isDark ? DARK_THEME_COLOR : '#000000',
        backgroundColor: isDark ? bgColor : '',
      }}
    >
      <Button
        className='u-text14'
        disabled={acceptButtonDisabler}
        data-testid='acceptButton'
        data-track={isAcssProspectNewCustomerTab ? 'checkout_accept' : 'Conflict_Accept'}
        onClick={() => {
          onAcceptHandler();
        }}
        surface={isDark ? 'dark' : 'light'}
      >
        Accept
      </Button>
    </div>
  );
  const defaultConflictModalContentStyle = { marginTop: !scmCheckoutMfeEnabled ? getWidth() : '4rem' };
  const prospectConflictModalContentStyle = {
    marginTop: !scmCheckoutMfeEnabled ? getWidth() : '',
    maxHeight: '555px',
    overflowY: 'auto',
  };
  const ConflictModalContentStyle = isAcssProspectNewCustomerTab
    ? prospectConflictModalContentStyle
    : defaultConflictModalContentStyle;
  return (
    <PlanConflictsModal id='plan-conflict-modal' bgColor={bgColor}>
      {showConflicts && (
        <div style={{ backgroundColor: isDark ? bgColor : DARK_THEME_COLOR }}>
          <div className='conflictModalContent' style={ConflictModalContentStyle}>
            {/* {(sessionStorage?.getItem('enableFWA') === 'true') && (
                            <Padding20>
                                <Notification
                                    type="warning" title={[<div dangerouslySetInnerHTML={{ __html: homeAndInternetWarningMessage }} />]} surface="light" disableAnimation={false}
                                    fullBleed
                                    hideCloseButton={false}
                                    disableFocus
                                    inline={false}
                                    layout={null} />
                            </Padding20>
                        )} */}
            <div className='ConflictTop_12'>{content}</div>
          </div>
          <div style={{ position: 'fixed', bottom: 0, width: '100%', background: 'white' }} className='conflictsFooter'>
            <div className={`${isIpad() ? ' mobileHeader' : ''}`}>
              {scmCheckoutMfeEnabled && !isAcssProspectNewCustomerTab && (
                <div
                  className='u-textCenter LandingFooter u-paddingYMedium u-borderTopGray u-paddingAllLarge font-20 bold'
                  style={{
                    color: isDark ? DARK_THEME_COLOR : '#000000',
                    backgroundColor: isDark ? bgColor : '',
                    maxWidth: !scmCheckoutMfeEnabled ? '64rem' : 'unset',
                  }}
                >
                  <span
                    data-track='Go to order effective date'
                    data-testid='orderEffectiveDateModal'
                    className='u-cursorPointer'
                    tabIndex='0'
                    role='button'
                    onClick={() => props.effectiveDateModalHandler()}
                    onKeyDown={() => props.effectiveDateModalHandler()}
                  >
                    <span className='Icon Icon--calendar u-paddingAllSmall' />
                    <p className='u-displayInlineBlock'>The Order Effective Date is set to</p>
                    <span className='bold '> {effectiveDate} </span>
                    {/* <Icon name="checkmarkAlt" size="20" lineColor="#000" style={{ margin: "19px 5px 18px 2px" }} /> */}
                  </span>
                </div>
              )}
              {footer}
            </div>
          </div>
        </div>
      )}
    </PlanConflictsModal>
  );
}

export default PlanConflicts;
