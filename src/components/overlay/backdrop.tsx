import { useAppDispatch } from "../../store/hooks";
import { closeModalOverlay } from "../../store/slice/modal_overlay_slice";

interface BackdropProps {
  closeOnOutsideClick: boolean;
  onBakcdropClick: () => void;
}
const Backdrop: React.FC<BackdropProps> = ({
  closeOnOutsideClick = true,
  onBakcdropClick,
}: BackdropProps) => {
  const dispatch = useAppDispatch();

  return (
    <div
      onClick={() => {
        if (closeOnOutsideClick) {
          dispatch(closeModalOverlay());
        }
        onBakcdropClick?.();
      }}
      className="w-screen h-screen fixed  bg-black/50 inset-0 backdrop-blur-[2px] z-40"
    />
  );
};

export default Backdrop;
