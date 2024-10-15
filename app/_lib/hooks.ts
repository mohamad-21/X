import React, { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { ModalProps } from "./definitions";
import { AppDispatch, AppStore, RootState } from "./store";
import { useRouter } from "next/navigation";
import { setIsChangingRoute } from "./slices/appSlice";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useSelector.withTypes<AppStore>();

export const useIsVisible = (ref: React.RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const elementRef = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    });

    if (elementRef) {
      observer.observe(elementRef);
    }

    return () => {
      if (elementRef) {
        observer.disconnect();
      }
    }
  }, [ref, isVisible]);

  return isVisible;
}

export const useModalProps = (props?: ModalProps): ModalProps => {
  const [inMobile, setInMobile] = useState(false);

  useEffect(() => {
    const inMobileCheck = () => {
      if (window?.innerWidth < 641) {
        setInMobile(true);
      } else setInMobile(false);
    }

    inMobileCheck();

    window.addEventListener('resize', inMobileCheck)

    return () => {
      window.removeEventListener('resize', inMobileCheck);
    }
  }, []);

  return {
    className: `bg-background min-h-[40dvh] !overflow-hidden ${props?.className || ''}`,
    defaultOpen: props?.defaultOpen || true,
    isDismissable: props?.isDismissable || false,
    classNames: {
      wrapper: props?.classNames?.wrapper || (props?.ignureMobileSize ? '' : 'items-stretch'),
      backdrop: `${props?.classNames?.backdrop} ${props?.defaultBackdrop || 'bg-gray-700/60'}`,
      header: `${props?.classNames?.header || ''} z-[3] bg-background`,
      body: `${props?.classNames?.body} ${props?.centerContent ? 'px-[80px]' : 'px-[20px]'} pb-4 pt-8 overflow-y-auto`,
      footer: `${props?.classNames?.footer} ${props?.centerContent ? 'px-[80px]' : 'px-[20px]'}`,
      closeButton: `text-xl left-2.5 right-[none] z-[4] top-3 ${props?.classNames?.closeButton}`,
    },
    radius: props?.radius || "lg",
    scrollBehavior: inMobile ? undefined : (props?.scrollBehavior || "inside"),
    size: (props?.ignureMobileSize) ? (props.size || "md") : (inMobile ? 'full' : (props?.size || "md")),
    shouldBlockScroll: props?.shouldBlockScroll || true,
    placement: props?.placement || 'center'
  }
}

export const useRouteChangeTransition = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const dispatch = useAppDispatch();

  function changeRoute(route: string) {
    startTransition(() => {
      router.push(route);
    })
  }

  useEffect(() => {
    if (isPending) {
      dispatch(setIsChangingRoute(true));
    } else {
      dispatch(setIsChangingRoute(false));
    }
  }, [isPending, startTransition, router]);

  return changeRoute;
}