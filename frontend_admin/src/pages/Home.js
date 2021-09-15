import { useState } from 'react';

import PageLayout from '../layout/PageLayout';
import Button from 'react-bootstrap/Button';

import { toast } from 'react-toastify';

const Home = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    toast.info("Privet!", {
      icon: "👋"
    });
  };

  return (
    <PageLayout>
      <h1> User Management System</h1>
      <Button onClick={handleClick}>Summon Toast {count}</Button>
      <hr />

      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sollicitudin quam mauris, in pharetra tortor egestas non. Cras pellentesque gravida tristique. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla vitae lorem sem. Suspendisse eu viverra quam. Nunc tincidunt eros nec eros scelerisque, et porta libero efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam quis ligula sed magna gravida tempus eget nec augue. Nam purus lorem, vehicula in lacinia sit amet, laoreet vitae enim. Curabitur ac rhoncus ipsum. Mauris nec finibus augue. Donec vestibulum lorem a erat accumsan viverra. Nunc ultricies erat leo, quis tempus augue egestas id. In tristique ultricies lacus a aliquet.</p>

      <p>Integer a lectus rutrum, lacinia libero vitae, aliquam nisi. Proin quis luctus dolor, quis sodales nunc. Curabitur sit amet commodo odio. Quisque tristique aliquet rhoncus. Nullam sodales dolor ut est ullamcorper, eget posuere ex cursus. Vivamus eu nunc dolor. Fusce consectetur eget est id sagittis.</p>

      <p>In vel erat magna. Aliquam purus metus, ornare a scelerisque sed, rhoncus vitae libero. Nullam nibh odio, imperdiet ultrices consequat sed, accumsan in nisi. Etiam consectetur risus vitae facilisis ultricies. Fusce quis neque sed tortor pretium commodo. Nullam dignissim dui ac augue iaculis, ut elementum purus molestie. Duis luctus nisi a dui ullamcorper, et eleifend dolor posuere. Nunc metus lectus, mattis quis leo blandit, mattis viverra purus. Pellentesque vitae mollis quam. Ut suscipit justo eu consequat posuere. Mauris suscipit ex erat, at accumsan elit suscipit vel. Fusce aliquet enim ut odio scelerisque ultricies. Pellentesque rutrum, dui id ornare ullamcorper, tortor erat posuere sapien, varius tincidunt erat justo et arcu. Morbi nec aliquet tortor. Suspendisse potenti.</p>

      <p>Quisque ultrices mi ac tellus facilisis tempor. Sed sagittis elit ac ipsum semper, et laoreet leo suscipit. Fusce quis aliquam ligula. Nulla nunc ligula, egestas sit amet dapibus in, ullamcorper gravida massa. Ut nisl sem, porttitor in tellus ac, condimentum scelerisque lacus. Cras viverra sed velit eget dapibus. Donec pellentesque suscipit ante in iaculis. Ut at eros eu nisi feugiat laoreet vitae in risus. Nullam varius convallis nisi, at aliquet turpis feugiat eu. Suspendisse posuere, leo sed finibus porta, diam urna fermentum nisl, ullamcorper luctus enim neque quis magna. Proin rhoncus blandit tellus quis tincidunt. Vivamus pretium nibh nulla, eu auctor nisl hendrerit ac. Ut consectetur euismod nunc sed convallis. Donec purus quam, pharetra nec quam sed, vulputate ornare urna.</p>

      <p>Aenean tincidunt leo efficitur erat vulputate, eu sollicitudin odio bibendum. Pellentesque nec enim pulvinar, iaculis dui dictum, tincidunt sapien. Integer sodales malesuada accumsan. Nam tincidunt pellentesque felis, nec fermentum dolor aliquet ut. Donec id consequat sem, in tincidunt tellus. Donec condimentum elit vitae tempor laoreet. Etiam massa ex, pharetra ac dolor commodo, rhoncus sodales neque. Cras dapibus erat odio, at molestie dui gravida sed. Suspendisse potenti. Vivamus sed feugiat nulla. Aliquam varius magna vel urna pharetra, a volutpat eros dictum. Etiam dolor elit, fermentum vulputate dui a, bibendum dapibus neque.</p>

      <p>Sed lobortis arcu ipsum, ac ornare felis tempor et. Ut eu consectetur orci. Nunc quis massa in nulla commodo suscipit blandit et nibh. Curabitur a turpis urna. Nullam lacinia ligula augue, a sagittis mauris lacinia nec. Mauris ac quam ut neque finibus semper. Vivamus sed est fringilla nibh vulputate dapibus. Etiam fringilla, sem a viverra lacinia, sem nibh interdum quam, et aliquam nulla lectus in lorem. Nunc pretium scelerisque arcu. Nam egestas sem dolor, nec condimentum enim ultricies vitae.</p>

      <p>Phasellus ac dolor cursus, aliquet nisi id, lacinia mauris. Sed congue sem quis velit convallis aliquam. Vestibulum finibus felis neque, sit amet fermentum dui hendrerit sed. Proin tincidunt lacinia arcu, faucibus lobortis augue vehicula a. Curabitur suscipit aliquam odio, ac iaculis dui. Nulla libero turpis, iaculis eget nulla at, faucibus condimentum lorem. Cras lobortis arcu sapien, ut posuere ipsum ornare eget. Etiam lacus neque, pulvinar nec lacinia at, mollis at tellus. Integer in diam luctus, imperdiet nisi in, luctus diam.</p>

      <p>Mauris gravida urna ipsum, non aliquam est sollicitudin non. Fusce eu quam ut metus porttitor scelerisque. Morbi et erat nulla. Vivamus vitae arcu ut purus rhoncus tempus. In gravida, augue ac auctor vestibulum, sem orci cursus lacus, id sollicitudin arcu massa quis ex. Nulla scelerisque, lacus ut elementum gravida, felis arcu tincidunt arcu, non euismod orci mi eget lectus. In vulputate, ligula in egestas convallis, libero est venenatis leo, vitae iaculis magna ipsum eget nisi. Sed dignissim velit eget nunc pulvinar, eget sagittis dui sodales. Phasellus suscipit ante tortor, ac faucibus lorem aliquam ac. Suspendisse molestie justo at commodo interdum. Nunc posuere ornare justo egestas ultricies.</p>

      <p>Integer eget justo metus. Proin laoreet suscipit elit eget consectetur. Donec at posuere velit. Proin ex nulla, varius vel ante sit amet, egestas dictum tellus. Praesent sed venenatis purus. In mattis, velit eget dapibus laoreet, enim orci elementum mi, sed lobortis justo lacus sit amet turpis. Nullam varius, ipsum bibendum congue tincidunt, ante neque sodales neque, et sollicitudin orci massa sed turpis. Morbi vehicula sagittis nisl, ut ornare quam auctor sit amet. Curabitur ornare posuere tempor.</p>

      <p>Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer non hendrerit sem, sit amet tempus dolor. Proin vitae metus at nisi convallis vehicula. Sed ut dolor arcu. Aenean eu porttitor est. Aliquam non nisl arcu. Mauris non tortor velit. Vestibulum molestie libero nulla, eget porta turpis molestie non. Proin eu erat quis nunc pharetra tristique eu nec lorem. Vivamus varius eros odio. Morbi nec enim posuere, pulvinar velit a, venenatis lectus. Nulla facilisi. In pulvinar cursus consequat. Integer porttitor consectetur ipsum eu cursus. Cras sem nibh, pretium sed metus auctor, scelerisque accumsan turpis. Donec libero mauris, dignissim ac gravida sed, varius quis turpis.</p>
    </PageLayout>
  );
}

export default Home;
