import renderer from "react-test-renderer";
import Favoritelist from "./Favoritelist";


it('renders correctly', () => {
    const tree = renderer
      .create(<Favoritelist page="https://easy-hangout-68597.web.app/favorites">Favorites</Favoritelist>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });