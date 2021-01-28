import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, FormGroup, Input, Table } from 'reactstrap';
import GithubRepository from './repositories/GithubRepository';
import IfComponent from './components/IfComponent';
import loading from './assets/loading.gif';

const App = (props) => {

	const scrollObserve = useRef();

	const [termo, setTermo] = useState('');
	const [page, setPage] = useState(0);
	const [repositories, setRepositories] = useState([]);
	const [showLoad, setShowLoad] = useState(false);
	const [scrollRadio, setScrollRadio] = useState(null);

	const findRepositories = (page) =>{
		setShowLoad(true);
		GithubRepository.findRepositoriesGit(termo, page).then(({ data })=>{
			const novosRepositories = [...repositories];
			novosRepositories.push(...data.items);
			setRepositories(novosRepositories);
			setShowLoad(false);
		});
	};

	const intersectionObserve = new IntersectionObserver((entries)=>{
		const radio = entries[0].intersectionRatio;
		setScrollRadio(radio);
	});

	useEffect(()=>{
		intersectionObserve.observe(scrollObserve.current);
		return () => {
			intersectionObserve.disconnect();
		};
	}, []);

	useEffect(()=>{
		if(scrollRadio>0 && termo != ''){
			const novaPage = page+1;
			setPage(novaPage);
			findRepositories(novaPage);
		}
	}, [scrollRadio]);


	return (
		<div className={"App p-4"}>
		<h1>Digite o Termo</h1>
			<Form>
				<FormGroup>
					<Input onClick={(e) => setTermo(e.target.value)} type={'text'}/>
				</FormGroup>
				<Button onClick={ () => {findRepositories(page);} }>Buscar</Button>
			</Form>
			<br/>
			<br/>

			<IfComponent conditional={ repositories.length > 0 }>

				<Table>
					<tr>
						<th>Avatar</th>
						<th>Url</th>
						<th>Start</th>
					</tr>
				{ repositories.map(r => {
					return (
						<tr>
							<td><img src={ r.owner.avatar_url} width='50'/></td>
							<td><a href={ r.html_url } target='_blank'>{ r.html_url }</a></td>
							<td>{ r.stargazers_count }</td>
						</tr>
					)
				} ) }
				</Table>
			</IfComponent>
			<div ref={ scrollObserve }></div>
			<IfComponent conditional={ showLoad }>
				<div><img src={ loading } width='50'/>Loading</div>
			</IfComponent>
		</div>
  );
}

export default App;
