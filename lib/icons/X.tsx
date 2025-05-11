import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Text} from "@/components/ui/text"


export function X(props) {
    return <Text><FontAwesome name="times-circle"  {...props} /></Text>;
  }