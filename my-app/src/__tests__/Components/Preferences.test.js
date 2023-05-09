import renderer from "react-test-renderer";
import PreferenceLink from "../../Components/Preferences";

it('renders correctly', () => {
    const tree = renderer
      .create(<PreferenceLink page="https://easy-hangout-68597.web.app/preferences">Favorites</PreferenceLink>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });