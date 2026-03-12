// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   TextStyle,
// } from "react-native";
// import SvgIcon from "@/app/styles/SvgIcons";

// type Props = {
//   label: string;
//   value: string;
//   onValueChange: (value: string) => void;
//   primaryColor: string;
//   backgroundColor: string;
//   buttonColor: string;
//   textStyle: TextStyle;
//   icon?: React.ReactElement;
//   buttonPadding?: number;
//   keyboardType?: "default" | "phone-pad" | "email-address" | "numeric";
//   placeholder?: string;
//   validate?: (value: string) => string | null;
// };

// const OptionInputEdit: React.FC<Props> = ({
//   label,
//   value,
//   onValueChange,
//   primaryColor,
//   backgroundColor,
//   buttonColor,
//   textStyle,
//   icon,
//   buttonPadding = 4,
//   keyboardType = "default",
//   placeholder = "None",
//   validate,
// }) => {
//   const [showEdit, setShowEdit] = useState(false);
//   const error = validate ? validate(value) : null;

//   const handleConfirm = () => {
//     if (error) return;
//     setShowEdit(false);
//   };

//   const handleCancel = () => {
//     setShowEdit(false);
//   };

//   return (
//     <Pressable
//       onPress={() => !showEdit && setShowEdit(true)}
//       style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}
//       android_ripple={{ color: "rgba(255,255,255,0.08)" }}
//     >
//       <View style={[styles.inner, { backgroundColor }]}>

//         {/* left: icon + label */}
//         <View style={styles.left}>
//           {!!icon && <View style={styles.iconWrap}>{icon}</View>}
//           <View style={styles.labelColumn}>
//             <Text
//               style={[textStyle, styles.label, { color: primaryColor }]}
//               numberOfLines={1}
//             >
//               {label}
//             </Text>
//             {showEdit && !!error && (
//               <Text style={styles.errorText}>{error}</Text>
//             )}
//           </View>
//         </View>

//         {/* center: value or input */}
//         <View style={styles.valueColumn}>
//           {showEdit ? (
//             <TextInput
//               style={[
//                 textStyle,
//                 styles.input,
//                 {
//                   color: primaryColor,
//                   borderBottomColor: error ? "red" : primaryColor,
//                 },
//               ]}
//               value={value}
//               onChangeText={onValueChange}
//               autoFocus
//               keyboardType={keyboardType}
//               placeholder={placeholder}
//               placeholderTextColor={primaryColor}
//             />
//           ) : (
//             <Text
//               style={[
//                 textStyle,
//                 styles.valueText,
//                 { color: primaryColor },
//                 !value && styles.placeholderText,
//               ]}
//               numberOfLines={1}
//             >
//               {value || placeholder}
//             </Text>
//           )}
//         </View>

//         {/* right: actions */}
//         <View style={styles.actionsColumn}>
//           {!showEdit ? (
//             <Pressable onPress={() => setShowEdit(true)}>
//               <SvgIcon name="pencil" size={18} color={primaryColor} />
//             </Pressable>
//           ) : (
//             <>
//               <Pressable onPress={handleCancel} style={styles.cancelButton}>
//                 <SvgIcon name="cancel" size={18} color={primaryColor} />
//               </Pressable>
//               <Pressable onPress={handleConfirm} disabled={!!error}>
//                 <SvgIcon
//                   name="check"
//                   size={18}
//                   color={error ? "gray" : primaryColor}
//                 />
//               </Pressable>
//             </>
//           )}
//         </View>

//       </View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     width: "100%",
//     borderRadius: 10,
//   },
//   inner: {
//     borderRadius: 6,
//     paddingVertical: 1,
//     paddingHorizontal: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     minHeight: 44,
//   },
//   left: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: 100,
//   },
//   iconWrap: {
//     marginRight: 12,
//   },
//   labelColumn: {
//     flexDirection: "column",
//     justifyContent: "center",
//   },
//   label: {
//     flexShrink: 1,
//   },
//   errorText: {
//     fontSize: 9,
//     color: "red",
//     marginTop: 2,
//   },
//   valueColumn: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   valueText: {
//     fontSize: 14,
//   },
//   placeholderText: {
//     opacity: 0.4,
//   },
//   input: {
//     fontSize: 14,
//     borderBottomWidth: 1,
//     paddingVertical: 2,
//   },
//   actionsColumn: {
//     flexDirection: "row",
//     alignItems: "center",
//     minWidth: 52,
//     justifyContent: "flex-end",
//   },
//   cancelButton: {
//     marginRight: 10,
//   },
// });

// export default OptionInputEdit;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TextStyle,
} from "react-native";
import SvgIcon from "@/app/styles/SvgIcons";

type Props = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  primaryColor: string;
  backgroundColor: string;
  buttonColor: string;
  textStyle: TextStyle;
  icon?: React.ReactElement;
  buttonPadding?: number;
  keyboardType?: "default" | "phone-pad" | "email-address" | "numeric";
  placeholder?: string;
  validate?: (value: string) => string | null;
  onConfirm?: () => void;
};

const OptionInputEdit: React.FC<Props> = ({
  label,
  value,
  onValueChange,
  primaryColor,
  backgroundColor,
  buttonColor,
  textStyle,
  icon,
  buttonPadding = 4,
  keyboardType = "default",
  placeholder = "None",
  validate,
  onConfirm,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const error = validate ? validate(value) : null;

  const handleConfirm = () => {
    if (error) return;
    onConfirm?.();
    setShowEdit(false);
  };

  const handleCancel = () => {
    setShowEdit(false);
  };

  return (
    <Pressable
      onPress={() => !showEdit && setShowEdit(true)}
      style={[styles.button, { padding: buttonPadding, backgroundColor: buttonColor }]}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
    >
      <View style={[styles.inner, { backgroundColor }]}>

        <View style={styles.left}>
          {!!icon && <View style={styles.iconWrap}>{icon}</View>}
          <View style={styles.labelColumn}>
            <Text
              style={[textStyle, styles.label, { color: primaryColor }]}
              numberOfLines={1}
            >
              {label}
            </Text>
            {showEdit && !!error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>
        </View>

        <View style={styles.valueColumn}>
          {showEdit ? (
            <TextInput
              style={[
                textStyle,
                styles.input,
                {
                  color: primaryColor,
                  borderBottomColor: error ? "red" : primaryColor,
                },
              ]}
              value={value}
              onChangeText={onValueChange}
              autoFocus
              keyboardType={keyboardType}
              placeholder={placeholder}
              placeholderTextColor={primaryColor}
              onSubmitEditing={handleConfirm}
            />
          ) : (
            <Text
              style={[
                textStyle,
                styles.valueText,
                { color: primaryColor },
                !value && styles.placeholderText,
              ]}
              numberOfLines={1}
            >
              {value || placeholder}
            </Text>
          )}
        </View>

        <View style={styles.actionsColumn}>
          {!showEdit ? (
            <Pressable onPress={() => setShowEdit(true)}>
              <SvgIcon name="pencil" size={18} color={primaryColor} />
            </Pressable>
          ) : (
            <>
              <Pressable onPress={handleCancel} style={styles.cancelButton}>
                <SvgIcon name="cancel" size={18} color={primaryColor} />
              </Pressable>
              <Pressable onPress={handleConfirm} disabled={!!error}>
                <SvgIcon
                  name="check"
                  size={18}
                  color={error ? "gray" : primaryColor}
                />
              </Pressable>
            </>
          )}
        </View>

      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 10,
  },
  inner: {
    borderRadius: 6,
    paddingVertical: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
  },
  iconWrap: {
    marginRight: 12,
  },
  labelColumn: {
    flexDirection: "column",
    justifyContent: "center",
  },
  label: {
    flexShrink: 1,
  },
  errorText: {
    fontSize: 9,
    color: "red",
    marginTop: 2,
  },
  valueColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  valueText: {
    fontSize: 14,
  },
  placeholderText: {
    opacity: 0.4,
  },
  input: {
    fontSize: 14,
    borderBottomWidth: 1,
    paddingVertical: 2,
  },
  actionsColumn: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 52,
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 10,
  },
});

export default OptionInputEdit;