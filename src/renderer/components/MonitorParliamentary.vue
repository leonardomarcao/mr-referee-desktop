<template>
  <div class="d-flex" id="wrapper">
    <div class="page-wrapper chiller-theme toggled">
      <nav id="sidebar" class="sidebar-wrapper">
        <div class="sidebar-content">
          <div class="sidebar-brand">
            <a href="#">Gastos Públicos Suspeitos</a>
            <div id="close-sidebar">
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="sidebar-header">
            <div class="user-pic">
              <img class="img-responsive img-rounded"
                   src="../assets/images/avatar/avatar-3.png"
                   alt="User picture">
            </div>
            <div class="user-info">
              <span class="user-name">Mr.
                <strong>Referee</strong>
              </span>
              <span class="user-role">Administrator</span>
              <span class="user-status">
                <i class="fa fa-circle"></i>
                <span>Online</span>
              </span>
            </div>
          </div>
          <!-- sidebar-search  -->
          <div class="sidebar-menu">
            <ul>
              <li class="header-menu">
                <span>General</span>
              </li>
              <li>
                <router-link to="/">
                  <i class="fa fa-home"></i>
                  <span>Início</span>
                </router-link>
              </li>
              <li>
                <router-link to="/monitor">
                  <i class="fa fa-list"></i>
                  <span>Acompanhamento</span>
                </router-link>
              </li>
              <li>
                <div>
                  <router-link to="/new-parliamentary">
                    <i class="fa fa-plus-square"></i>
                    <span>Novo Parlamentar</span>
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
          <!-- sidebar-menu  -->
        </div>
      </nav>
      <!-- sidebar-wrapper  -->
      <div class="page-content">
        <div class="container-fluid">
          <div class="row text-center">
            <img :src="person.avatar_url" class="avatar avatar-xs rounded-circle img-responsive" alt=""/>
          </div>
          <br/>
          <h5>{{ person.name }}</h5>
          <hr/>
          <div v-for="reimbursement in reimbursements">
            <timeline>
              <timeline-title>
                <b>{{ new Date(reimbursement.date).toLocaleDateString('pt-BR') }}</b>
              </timeline-title>
              <timeline-item :bg-color="reimbursement.color">
                <b>Descrição:</b> {{ reimbursement.title }}<br/>
                <b>Fornecedor:</b> {{ reimbursement.supplier }}<br/>
                <b>CNPJ:</b> {{ reimbursement.supplier_cnpj }}<br/>
                <b>Valor:</b> {{ reimbursement.value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}}<br/>
                <b v-if="reimbursement.suspincions_data">Motivo: {{ reimbursement.suspincions_data }}</b><br/>
                <b-button v-if="parliamentary.receipt" class="btn-sm" @click="openExternalLink(reimbursement.receipt)"
                          variant="primary" target="_blank">Ver Documento</b-button>
              </timeline-item>
            </timeline>
          </div>
        </div>
        <lottie class="loader"
                :options="defaultOptions"
                v-on:animCreated="handleAnimation"
                v-if="loading"
        />
      </div>
    </div>
  </div>
  <!-- page-content" -->
  <!-- page-wrapper -->
</template>

<script>
import axios from 'axios'
import Lottie from 'vue-lottie/src/lottie'
import * as animationData from '../assets/lottie/37725-loading-50-among-us.json'
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
import {shell} from 'electron'
export default {
  components: {
    Lottie,
    Timeline,
    TimelineItem,
    TimelineTitle
  },
  data () {
    return {
      loading: false,
      parliamentary: [],
      reimbursements: [],
      person: [],
      defaultOptions: {animationData: animationData}
    }
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim
    },
    openExternalLink (link) {
      shell.openExternal(link)
    },
    handleSuspincions (suspincions) {
      if (suspincions) {
        if (suspincions.meal_price_outlier) return 'Preço de refeição muito incomum'
        if (suspincions.over_monthly_subquote_limit) return 'Extrapolou limite da (sub)quota'
        if (suspincions.suspicions_traveled_speed_day) return 'Muitas despesas em diferentes cidades no mesmo dia'
        if (suspincions.invalid_cnpj_cpf) return 'CPF ou CNPJ inválidos'
        if (suspincions.election_expenses) return 'Gasto com campanha eleitoral'
        if (suspincions.irregular_companies_classifier) return 'CNPJ Irregular'
      } else return suspincions
    },
    async pullParliamentarias (id) {
      this.loading = true
      await axios.get(`http://localhost:3333/parlamentar/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => (this.parliamentary = response.data)).finally(() => {
        this.loading = false
      })
    },
    async mountReimbursements (id) {
      await this.pullParliamentarias(id)
      if (this.parliamentary) {
        this.reimbursements = this.parliamentary.reimbursements.map(e => ({
          color: e.suspicions != null ? 'red' : 'blue',
          title: e.subquota_description,
          date: e.issue_date,
          supplier: e.supplier,
          supplier_cnpj: e.cnpj_cpf,
          suspincions_data: this.handleSuspincions(e.suspicions),
          receipt: e.receipt,
          value: e.document_value
        }))
        this.person = this.parliamentary.parlamentar_data
      }
    }
  },
  mounted () {
    this.mountReimbursements(this.$route.params.id)
  }
}
</script>


<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css');
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: .8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}

@keyframes swing {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(0deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(0deg);
  }
  60% {
    transform: rotate(5deg);
  }
  70% {
    transform: rotate(0deg);
  }
  80% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes sonar {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

body {
  font-size: 0.9rem;
}

.page-wrapper .sidebar-wrapper,
.sidebar-wrapper .sidebar-brand > a,
.sidebar-wrapper .sidebar-dropdown > a:after,
.sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li a:before,
.sidebar-wrapper ul li a i,
.page-wrapper .page-content,
.sidebar-wrapper .sidebar-search input.search-menu,
.sidebar-wrapper .sidebar-search .input-group-text,
.sidebar-wrapper .sidebar-menu ul li a,
#show-sidebar,
#close-sidebar {
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}

/*----------------page-wrapper----------------*/

.loader{  /* Loader Div Class */
  position: absolute;
  top:0px;
  right:0px;
  width:100%;
  height:100%;
  background-color:#eceaea;
  /*background-image: url('../assets/lottie/animation_640_kh3pkve6.gif');*/
  background-repeat:no-repeat;
  background-position:center;
  z-index:10000000;
  filter: alpha(opacity=40);
}

.page-wrapper {
  height: 100vh;
}

.page-wrapper .theme {
  width: 40px;
  height: 40px;
  display: inline-block;
  border-radius: 4px;
  margin: 2px;
}

.page-wrapper .theme.chiller-theme {
  background: #1e2229;
}

/*----------------toggeled sidebar----------------*/

.page-wrapper.toggled .sidebar-wrapper {
  left: 0px;
}

@media screen and (min-width: 768px) {
  .page-wrapper.toggled .page-content {
    padding-left: 300px;
  }
}

/*----------------show sidebar button----------------*/
#show-sidebar {
  position: fixed;
  left: 0;
  top: 10px;
  border-radius: 0 4px 4px 0px;
  width: 35px;
  transition-delay: 0.3s;
}

.page-wrapper.toggled #show-sidebar {
  left: -40px;
}

/*----------------sidebar-wrapper----------------*/

.sidebar-wrapper {
  width: 260px;
  height: 100%;
  max-height: 100%;
  position: fixed;
  top: 0;
  left: -300px;
  z-index: 999;
}

.sidebar-wrapper ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-wrapper a {
  text-decoration: none;
}

/*----------------sidebar-content----------------*/

.sidebar-content {
  max-height: calc(100% - 30px);
  height: calc(100% - 30px);
  overflow-y: auto;
  position: relative;
}

.sidebar-content.desktop {
  overflow-y: hidden;
}

/*--------------------sidebar-brand----------------------*/

.sidebar-wrapper .sidebar-brand {
  padding: 10px 20px;
  display: flex;
  align-items: center;
}

.sidebar-wrapper .sidebar-brand > a {
  text-transform: uppercase;
  font-weight: bold;
  flex-grow: 1;
}

.sidebar-wrapper .sidebar-brand #close-sidebar {
  cursor: pointer;
  font-size: 20px;
}

/*--------------------sidebar-header----------------------*/

.sidebar-wrapper .sidebar-header {
  padding: 20px;
  overflow: hidden;
}

.sidebar-wrapper .sidebar-header .user-pic {
  float: left;
  width: 60px;
  padding: 2px;
  border-radius: 12px;
  margin-right: 15px;
  overflow: hidden;
}

.sidebar-wrapper .sidebar-header .user-pic img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.sidebar-wrapper .sidebar-header .user-info {
  float: left;
}

.sidebar-wrapper .sidebar-header .user-info > span {
  display: block;
}

.sidebar-wrapper .sidebar-header .user-info .user-role {
  font-size: 12px;
}

.sidebar-wrapper .sidebar-header .user-info .user-status {
  font-size: 11px;
  margin-top: 4px;
}

.sidebar-wrapper .sidebar-header .user-info .user-status i {
  font-size: 8px;
  margin-right: 4px;
  color: #5cb85c;
}

/*-----------------------sidebar-search------------------------*/

.sidebar-wrapper .sidebar-search > div {
  padding: 10px 20px;
}

/*----------------------sidebar-menu-------------------------*/

.sidebar-wrapper .sidebar-menu {
  padding-bottom: 10px;
}

.sidebar-wrapper .sidebar-menu .header-menu span {
  font-weight: bold;
  font-size: 14px;
  padding: 15px 20px 5px 20px;
  display: inline-block;
}

.sidebar-wrapper .sidebar-menu ul li a {
  display: inline-block;
  width: 100%;
  text-decoration: none;
  position: relative;
  padding: 8px 30px 8px 20px;
}

.sidebar-wrapper .sidebar-menu ul li a i {
  margin-right: 10px;
  font-size: 12px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
}

.sidebar-wrapper .sidebar-menu ul li a:hover > i::before {
  display: inline-block;
  animation: swing ease-in-out 0.5s 1 alternate;
}

.sidebar-wrapper .sidebar-menu .sidebar-dropdown > a:after {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  content: "\f105";
  font-style: normal;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: 0 0;
  position: absolute;
  right: 15px;
  top: 14px;
}

.sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu ul {
  padding: 5px 0;
}

.sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li {
  padding-left: 25px;
  font-size: 13px;
}

.sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li a:before {
  content: "\f111";
  font-family: "Font Awesome 5 Free";
  font-weight: 400;
  font-style: normal;
  display: inline-block;
  text-align: center;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-right: 10px;
  font-size: 8px;
}

.sidebar-wrapper .sidebar-menu ul li a span.label,
.sidebar-wrapper .sidebar-menu ul li a span.badge {
  float: right;
  margin-top: 8px;
  margin-left: 5px;
}

.sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li a .badge,
.sidebar-wrapper .sidebar-menu .sidebar-dropdown .sidebar-submenu li a .label {
  float: right;
  margin-top: 0px;
}

.sidebar-wrapper .sidebar-menu .sidebar-submenu {
  display: none;
}

.sidebar-wrapper .sidebar-menu .sidebar-dropdown.active > a:after {
  transform: rotate(90deg);
  right: 17px;
}

/*--------------------------side-footer------------------------------*/

.sidebar-footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
}

.sidebar-footer > a {
  flex-grow: 1;
  text-align: center;
  height: 30px;
  line-height: 30px;
  position: relative;
}

.sidebar-footer > a .notification {
  position: absolute;
  top: 0;
}

.badge-sonar {
  display: inline-block;
  background: #980303;
  border-radius: 50%;
  height: 8px;
  width: 8px;
  position: absolute;
  top: 0;
}

.badge-sonar:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  border: 2px solid #980303;
  opacity: 0;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: sonar 1.5s infinite;
}

/*--------------------------page-content-----------------------------*/

.page-wrapper .page-content {
  display: inline-block;
  width: 100%;
  padding-left: 0px;
  padding-top: 20px;
}

.page-wrapper .page-content > div {
  padding: 20px 40px;
}

.page-wrapper .page-content {
  overflow-x: hidden;
}

/*------scroll bar---------------------*/

::-webkit-scrollbar {
  width: 5px;
  height: 7px;
}

::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar-thumb {
  background: #525965;
  border: 0px none #ffffff;
  border-radius: 0px;
}

::-webkit-scrollbar-thumb:hover {
  background: #525965;
}

::-webkit-scrollbar-thumb:active {
  background: #525965;
}

::-webkit-scrollbar-track {
  background: transparent;
  border: 0px none #ffffff;
  border-radius: 50px;
}

::-webkit-scrollbar-track:hover {
  background: transparent;
}

::-webkit-scrollbar-track:active {
  background: transparent;
}

::-webkit-scrollbar-corner {
  background: transparent;
}


/*-----------------------------chiller-theme-------------------------------------------------*/

.chiller-theme .sidebar-wrapper {
  background: #31353D;
}

.chiller-theme .sidebar-wrapper .sidebar-header,
.chiller-theme .sidebar-wrapper .sidebar-search,
.chiller-theme .sidebar-wrapper .sidebar-menu {
  border-top: 1px solid #3a3f48;
}

.chiller-theme .sidebar-wrapper .sidebar-search input.search-menu,
.chiller-theme .sidebar-wrapper .sidebar-search .input-group-text {
  border-color: transparent;
  box-shadow: none;
}

.chiller-theme .sidebar-wrapper .sidebar-header .user-info .user-role,
.chiller-theme .sidebar-wrapper .sidebar-header .user-info .user-status,
.chiller-theme .sidebar-wrapper .sidebar-search input.search-menu,
.chiller-theme .sidebar-wrapper .sidebar-search .input-group-text,
.chiller-theme .sidebar-wrapper .sidebar-brand > a,
.chiller-theme .sidebar-wrapper .sidebar-menu ul li a,
.chiller-theme .sidebar-footer > a {
  color: #818896;
}

.chiller-theme .sidebar-wrapper .sidebar-menu ul li:hover > a,
.chiller-theme .sidebar-wrapper .sidebar-menu .sidebar-dropdown.active > a,
.chiller-theme .sidebar-wrapper .sidebar-header .user-info,
.chiller-theme .sidebar-wrapper .sidebar-brand > a:hover,
.chiller-theme .sidebar-footer > a:hover i {
  color: #b8bfce;
}

.page-wrapper.chiller-theme.toggled #close-sidebar {
  color: #bdbdbd;
}

.page-wrapper.chiller-theme.toggled #close-sidebar:hover {
  color: #ffffff;
}

.chiller-theme .sidebar-wrapper ul li:hover a i,
.chiller-theme .sidebar-wrapper .sidebar-dropdown .sidebar-submenu li a:hover:before,
.chiller-theme .sidebar-wrapper .sidebar-search input.search-menu:focus + span,
.chiller-theme .sidebar-wrapper .sidebar-menu .sidebar-dropdown.active a i {
  color: #16c7ff;
  text-shadow: 0px 0px 10px rgba(22, 199, 255, 0.5);
}

.chiller-theme .sidebar-wrapper .sidebar-menu ul li a i,
.chiller-theme .sidebar-wrapper .sidebar-menu .sidebar-dropdown div,
.chiller-theme .sidebar-wrapper .sidebar-search input.search-menu,
.chiller-theme .sidebar-wrapper .sidebar-search .input-group-text {
  background: #3a3f48;
}

.chiller-theme .sidebar-wrapper .sidebar-menu .header-menu span {
  color: #6c7b88;
}

.chiller-theme .sidebar-footer {
  background: #3a3f48;
  box-shadow: 0px -1px 5px #282c33;
  border-top: 1px solid #464a52;
}

.chiller-theme .sidebar-footer > a:first-child {
  border-left: none;
}

.chiller-theme .sidebar-footer > a:last-child {
  border-right: none;
}

</style>
